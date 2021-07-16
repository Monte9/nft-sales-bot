import 'dotenv/config';

import OpenSeaAPI from './api/OpenSeaAPI';
import TwitterAPI from './api/TwitterAPI';

import { Sale } from './types/OpenSeaSale';
import { composeTweet } from './utils/Twitter';
import { parseSales } from './utils/OpenSea';
import { OPENSEA_CONTRACTS } from './shared/Constants';

class TwitterMcBot {
  twitterAPI: TwitterAPI = null
  openSeaAPI: OpenSeaAPI = null

  constructor() {
    this.twitterAPI = new TwitterAPI(
      process.env.TWITTER_CONSUMER_KEY,
      process.env.TWITTER_CONSUMER_SECRET,
      process.env.TWITTER_ACCESS_TOKEN,
      process.env.TWITTER_ACCESS_TOKEN_SECRET,
    )

    this.openSeaAPI = new OpenSeaAPI(OPENSEA_CONTRACTS[2], "8485");
  }

  async runInstance() {
    console.log("Running NFT Flipping McBot")

    // Get latest events for the NFT
    let data = await this.openSeaAPI.getNFT()
    const saleEvents = data && data.asset_events

    // If missing saleEvents - nothing to do further
    if (saleEvents == null || saleEvents.length == 0) {
      console.log("Missing events from OpenSea Events API")
      return
    }

    const sales: [Sale] = parseSales(saleEvents)
    if (sales.length <= 1) {
      console.log("Only 1 sale - NFT hasn't been flipped yet")
      return
    }
    
    for (let i = 0; i < sales.length -1; i++) {
      const tweetText = composeTweet(sales[i], sales[i+1].salePrice)

      if (tweetText) {
        console.log(tweetText)
        // this.twitterAPI.postTweet(tweetText)
      }
    }
  }
}

const twitterBot = new TwitterMcBot()
twitterBot.runInstance()
