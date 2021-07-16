import { Collection, Asset, User, PaymentToken, Sale } from "../types/OpenSeaSale";

export function parseSales(saleEvents): [Sale] {
  let sales: [Sale] = saleEvents.map(saleEvent => {
    let collection: Collection = {
      name: saleEvent.asset.collection.name,
      twitterUsername: saleEvent.asset.collection.twitter_username,
      slug: saleEvent.asset.collection.slug
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

    let paymentToken: PaymentToken = {
      symbol: saleEvent.payment_token.symbol,
      name: saleEvent.payment_token.name,
      imageUrl: saleEvent.payment_token.image_url,
      decimals: saleEvent.payment_token.decimals,
      usdPrice: Math.round(Number(saleEvent.payment_token.usd_price) * 100) / 100
    }

    return {
      asset,
      buyer,
      seller,
      paymentToken,
      salePrice: saleEvent.total_price / Math.pow(10, paymentToken.decimals),
      saleId: saleEvent.id
    }
  })

  return sales
}
