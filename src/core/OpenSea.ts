import { Collection, Asset, User, PaymentToken, Sale } from '../types'
import {
  getCollectionFromAddress,
  getCollectionFromSlug
} from '../utils/OpenSea'
import {
  BAYC_MINT_PRICE_WEI,
  CLONE_X_MINT_PRICE_WEI,
  DEFAULT_WALLET_ADDRESS
} from '../utils/Crypto'

// Resolves the full allowlisted Collection for a v2 `nft` payload.
// v2 events only carry the collection slug + contract address, so we look up
// the rich metadata (symbol, name, twitter handle) from the Allowlist.
function resolveCollection(nft, fallback?: Collection): Collection {
  return (
    (nft.collection && getCollectionFromSlug(nft.collection)) ||
    (nft.contract && getCollectionFromAddress(nft.contract)) ||
    fallback || {
      address: nft.contract,
      name: nft.collection,
      slug: nft.collection,
      symbol: nft.collection
    }
  )
}

// Maps raw OpenSea v2 `asset_events` into the bot's Sale shape.
// `fallbackCollection` is the allowlisted collection we queried for, used to
// enrich metadata when an event can't be matched on its own slug/contract.
export function parseSales(
  saleEvents,
  fallbackCollection?: Collection
): Sale[] {
  if (!saleEvents) {
    return []
  }

  // v2 returns events newest-first, but sort defensively so callers can rely
  // on [0] being the most recent sale and the last item the oldest event.
  const sortedEvents = [...saleEvents].sort(
    (a, b) =>
      (b.event_timestamp || b.closing_date || 0) -
      (a.event_timestamp || a.closing_date || 0)
  )

  return sortedEvents.reduce((acc, saleEvent) => {
    const timestampSeconds = saleEvent.event_timestamp || saleEvent.closing_date

    // A usable event needs the NFT, the on-chain transaction and a timestamp
    if (saleEvent.nft && saleEvent.transaction && timestampSeconds) {
      const collection = resolveCollection(saleEvent.nft, fallbackCollection)

      const asset: Asset = {
        name: saleEvent.nft.name,
        tokenId: Number(saleEvent.nft.identifier),
        image: saleEvent.nft.display_image_url || saleEvent.nft.image_url,
        link: saleEvent.nft.opensea_url,
        collection
      }

      // v2 exposes seller/buyer as plain wallet addresses (no usernames)
      const buyer: User = {
        address: saleEvent.buyer || DEFAULT_WALLET_ADDRESS
      }

      const seller: User = {
        address: saleEvent.seller || DEFAULT_WALLET_ADDRESS
      }

      // v2 groups price details under `payment` (absent for mint/transfer)
      let paymentToken: PaymentToken = null
      if (saleEvent.payment) {
        paymentToken = {
          symbol: saleEvent.payment.symbol,
          decimals: saleEvent.payment.decimals
        }
      }

      // The default mint price is BAYC
      let mintPrice = BAYC_MINT_PRICE_WEI

      // For CloneX set the default mint price
      if (collection.slug === 'clonex') {
        mintPrice = CLONE_X_MINT_PRICE_WEI
      }

      // Get the sale price in wei, or fall back to the mint price
      const salePriceWei =
        Number(saleEvent.payment && saleEvent.payment.quantity) || mintPrice
      const decimals = (paymentToken && paymentToken.decimals) || 18

      const sale: Sale = {
        asset,
        buyer,
        seller,
        paymentToken,
        salePrice: salePriceWei / Math.pow(10, decimals),
        // v2 has no numeric event id; build a stable key from tx + token id
        openseaSaleId: `${saleEvent.transaction}:${saleEvent.nft.identifier}`,
        timestamp: new Date(timestampSeconds * 1000).toISOString(),
        transactionHash: saleEvent.transaction
      }

      acc.push(sale)
    }

    return acc
  }, [])
}
