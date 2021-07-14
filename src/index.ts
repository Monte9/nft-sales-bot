import 'dotenv/config';

import OpenSeaAPI from './api/OpenSeaAPI';
import TwitterAPI from './api/TwitterAPI';

import { Collection, Asset, User, PaymentToken, Sale } from './types/OpenSeaSale';

class TwitterMcBot {
  asset_range = 10
  twitterAPI: TwitterAPI = null
  openSeaAPI: OpenSeaAPI = null

  constructor() {  
    this.twitterAPI = new TwitterAPI(
      process.env.TWITTER_CONSUMER_KEY,
      process.env.TWITTER_CONSUMER_SECRET,
      process.env.TWITTER_ACCESS_TOKEN,
      process.env.TWITTER_ACCESS_TOKEN_SECRET,
    )

    this.openSeaAPI = new OpenSeaAPI();
  }

  async runInstance() {
    console.log("Running Twitter McBot")
    let sales: Sale[] = []

    // Get latest events for the NFT
    let data = await this.openSeaAPI.getNFT()
    const saleEvents = data && data.asset_events

    if (saleEvents == null || saleEvents.length == 0) {
      console.log("missing asset_events from OpenSea Events API")
      return
    }

    saleEvents.map(saleEvent => {
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
        address: saleEvent.seller.address,
        username: saleEvent.seller.user && saleEvent.seller.user.username || null
      }

      let paymentToken: PaymentToken = {
        symbol: saleEvent.payment_token.symbol,
        name: saleEvent.payment_token.name,
        imageUrl: saleEvent.payment_token.image_url,
        decimals: saleEvent.payment_token.decimals,
        usdPrice: Math.round(Number(saleEvent.payment_token.usd_price) * 100) / 100
      }

      let sale: Sale = {
        asset,
        buyer,
        seller,
        paymentToken,
        salePrice: saleEvent.total_price / Math.pow(10, paymentToken.decimals),
        saleId: saleEvent.id
      }
      
      sales.push(sale)
    })

    if (sales.length <= 1) {
      console.log("Only 1 sale - NFT hasn't been flipped yet")
      return
    }
    
    for (let i = 0; i < sales.length -1; i++) {
      const sale = sales[i]
      const salePrice = sale.salePrice
      const seller = sale.seller
      const boughtPrice = sales[i+1].salePrice

      const profitLossValue = Math.abs(salePrice - boughtPrice)
      const profitLossUSD = numberWithCommas(Math.round(profitLossValue * sale.paymentToken.usdPrice))
      const flipPercentage = ((salePrice - boughtPrice) / boughtPrice) * 100
      const flipPercentageRounded = Math.round(flipPercentage * 100) / 100
      const isProfitLoss = flipPercentageRounded > 0 ? 'PROFIT' : 'LOSS'
      const isProfitLossEmoji = flipPercentageRounded > 0 ? '📈 +' : '📉'

      let twitterUsername = sale.asset.collection.twitterUsername
      if (twitterUsername) {
        twitterUsername = `@${twitterUsername}`
      } else {
        twitterUsername = sale.asset.collection.name
      }

      const sellerAddressShort = seller.address.slice(0, 5) + '...' + seller.address.substr(seller.address.length - 4);
      const sellerName = seller.username || sellerAddressShort

      // Post a tweet
      const tweetText = `${sellerName} FLIPPED ${twitterUsername} #${sale.asset.tokenId} for a ${isProfitLoss} of $${profitLossUSD} (${isProfitLossEmoji} ${flipPercentageRounded}%)\n${sale.asset.link}`
      this.twitterAPI.postTweet(tweetText)
    }
  }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const twitterBot = new TwitterMcBot()
twitterBot.runInstance()
