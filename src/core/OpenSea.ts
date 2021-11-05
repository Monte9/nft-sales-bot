import { Collection, Asset, User, PaymentToken, Sale } from "../types";
import { rounded } from "../shared/Formatters";

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
        address: saleEvent.winner_account && saleEvent.winner_account.address || "0x0000000000000000000000000000000000000000",
        username: saleEvent.winner_account && saleEvent.winner_account.user && saleEvent.winner_account.user.username || "NullAddress"
      }

      let seller: User = {
        address: saleEvent.seller && saleEvent.seller.address || "0x0000000000000000000000000000000000000000",
        username: saleEvent.seller && saleEvent.seller.user && saleEvent.seller.user.username || "NullAddress"
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

      // Default to 0.08 ETH as the mint price
      const salePrice = Number(saleEvent.total_price) || 80000000000000000

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
