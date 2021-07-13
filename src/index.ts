import 'dotenv/config';

import OpenSeaAPI from './api/OpenSeaAPI';
import TwitterAPI from './api/TwitterAPI';

import OpenSeaSale from './types/OpenSeaSale';

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

    // Get latest events for the NFT
    let data = await this.openSeaAPI.getNFT()

    if (data == null || data["asset_events"] == null) {
      console.log("missing asset_events")
      return
    }

    const saleEvents = data["asset_events"]
    let sales: OpenSeaSale[] = []

    saleEvents.map(saleEvent => {
      let sale: OpenSeaSale = {
        amount: saleEvent.total_price / 1000000000000000000
      }
      
      console.log(sale.amount)

      sales.push(sale)
    })

    // Post a tweet
    // this.twitterAPI.postTweet("NFT Flipping McBot on Heroku + Typescript!")
  }
}

const twitterBot = new TwitterMcBot()
twitterBot.runInstance()
