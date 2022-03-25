import { Collection, Asset, User, PaymentToken, Sale } from "../types";
import { CollectionSlug } from "../shared/Constants";
import { rounded } from "../utils/Number";
import { BAYC_MINT_PRICE_WEI, CLONE_X_MINT_PRICE_WEI, DEFAULT_WALLET_ADDRESS } from "../utils/Crypto";

export function parseSales(saleEvents): Sale[] {
  return saleEvents.reduce((acc, saleEvent) => {
    // Sometimes asset can be empty
    if (saleEvent.asset && saleEvent.transaction) {

      // Uncomment the line below when adding a new collection
      // console.log(saleEvent.asset)

      let collection: Collection = {
        address: saleEvent.asset.asset_contract.address,
        symbol: saleEvent.asset.asset_contract.symbol,
        name: saleEvent.asset.collection.name,
        twitterUsername: saleEvent.asset.collection.twitter_username,
        slug: saleEvent.asset.collection.slug,
      }

      let asset: Asset = {
        name: saleEvent.asset.name,
        tokenId: Number(saleEvent.asset.token_id),
        image: saleEvent.asset.image_url,
        link: saleEvent.asset.permalink,
        collection,
      }

      let buyer: User = {
        address: saleEvent.winner_account && saleEvent.winner_account.address || DEFAULT_WALLET_ADDRESS,
        username: saleEvent.winner_account && saleEvent.winner_account.user && saleEvent.winner_account.user.username
      }

      let seller: User = {
        address: saleEvent.seller && saleEvent.seller.address || DEFAULT_WALLET_ADDRESS,
        username: saleEvent.seller && saleEvent.seller.user && saleEvent.seller.user.username
      }

      let paymentToken: PaymentToken = null
      if (saleEvent.payment_token !== null) {
        paymentToken = {
          symbol: saleEvent.payment_token.symbol,
          name: saleEvent.payment_token.name,
          imageUrl: saleEvent.payment_token.image_url,
          decimals: saleEvent.payment_token.decimals,
          usdPrice: rounded(Number(saleEvent.payment_token.usd_price))
        } 
      }

      // The default mint price is BAYC
      let mintPrice = BAYC_MINT_PRICE_WEI

      // For CloneX set the default mint price
      if (collection.slug === CollectionSlug.clonex) {
        mintPrice = CLONE_X_MINT_PRICE_WEI
      }

      // Get the sales price or the mint price
      const salePrice = Number(saleEvent.total_price) || mintPrice

      const sale = {
        asset,
        buyer,
        seller,
        paymentToken,
        salePrice: salePrice / Math.pow(10, paymentToken && paymentToken.decimals || 18),
        openseaSaleId: saleEvent.id,
        timestamp: saleEvent.transaction.timestamp,
        transactionHash: saleEvent.transaction.transaction_hash,
      }

      acc.push(sale)
    }

    return acc;
  }, [])
}
