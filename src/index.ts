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
    let saleEvents: [OpenSeaSale] = await this.openSeaAPI.getNFT()

    console.log(saleEvents)

    // saleEvents.map(sale => {
    //   console.log(sale.amount)
    // })

    // Post a tweet
    this.twitterAPI.postTweet("NFT Flipping McBot on Heroku + Typescript!")
  }
}

const twitterBot = new TwitterMcBot()
twitterBot.runInstance()
