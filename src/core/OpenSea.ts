import { rounded } from "../shared/Formatters";
import { Collection, Asset, User, PaymentToken, Sale, Transaction } from "../types";

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
          usdPrice: rounded(Number(saleEvent.payment_token.usd_price))
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
