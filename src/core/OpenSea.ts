import { CollectionStats, OpenSeaCollection } from "../types/OpenSeaCollection";
import { Collection, Asset, User, PaymentToken, Sale, Transaction } from "../types/OpenSeaSale";

export function parseSales(saleEvents): Sale[] {
  return saleEvents.reduce((acc, saleEvent) => {
    // Sometimes asset can be empty for some BAYC tokens
    if (saleEvent.asset && saleEvent.transaction) {
      let collection: Collection = {
        address: saleEvent.asset.asset_contract.address,
        symbol: saleEvent.asset.asset_contract.symbol,
        name: saleEvent.asset.collection.name,
        twitterUsername: saleEvent.asset.collection.twitter_username,
        slug: saleEvent.asset.collection.slug,
      }

      let asset: Asset = {
        tokenId: saleEvent.asset.token_id,
        image: saleEvent.asset.image_url,
        link: saleEvent.asset.permalink,
        collection,
      }

      let buyer: User = {
        address: saleEvent.winner_account.address,
        username: saleEvent.winner_account.user && saleEvent.winner_account.user.username || null
      }

      let seller: User = {
        address: saleEvent.seller && saleEvent.seller.address || "Unknown",
        username: saleEvent.seller && saleEvent.seller.user && saleEvent.seller.user.username || null
      }

      let paymentToken: PaymentToken = null
      if (saleEvent.payment_token !== null) {
        paymentToken = {
          symbol: saleEvent.payment_token.symbol,
          name: saleEvent.payment_token.name,
          imageUrl: saleEvent.payment_token.image_url,
          decimals: saleEvent.payment_token.decimals,
          usdPrice: Math.round(Number(saleEvent.payment_token.usd_price) * 100) / 100
        } 
      }

      let transaction: Transaction = {
        id: saleEvent.transaction.id,
        block_hash: saleEvent.transaction.block_hash,
        block_number: saleEvent.transaction.block_number,
        timestamp: saleEvent.transaction.timestamp,
        transaction_hash: saleEvent.transaction.transaction_hash,
        transaction_index: saleEvent.transaction.transaction_index,
      }

      const sale = {
        asset,
        buyer,
        seller,
        paymentToken,
        salePrice: saleEvent.total_price / Math.pow(10, paymentToken && paymentToken.decimals || 18),
        saleId: saleEvent.id,
        transaction
      }

      acc.push(sale)
    }

    return acc;
  }, [])
}

export function parseCollections(collections): OpenSeaCollection[] {
  return collections.reduce((acc, collection) => {
    // Ensure the primary_asset_contracts & stats exists
    if (collection.primary_asset_contracts.length > 0 && collection.stats) {
      let stats: CollectionStats = {
        floorPrice: collection.stats.floor_price
      }

      const assetContract = collection.primary_asset_contracts[0]

      const openSeaCollection: OpenSeaCollection = {
        address: assetContract.address,
        name: assetContract.name,
        symbol: assetContract.symbol,
        slug: collection.slug,
        twitterUsername: collection.twitter_username,
        ownedAssetCount: collection.owned_asset_count,
        stats
      }

      acc.push(openSeaCollection)
    }

    return acc;
  }, [])
}
