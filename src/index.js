import 'dotenv/config';

import OpenSeaAPI from './api/OpenSeaAPI';
import TwitterAPI from './api/TwitterAPI';

class TwitterMcBot {
  constructor() {
    this.asset_range = 10

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
    let saleEvents = await this.openSeaAPI.getNFT()

    console.log(saleEvents)

    // Post a tweet
    this.twitterAPI.postTweet("Another one.. from the NFT Flipping McBot! (from Heroku)")
  }
}

const twitterBot = new TwitterMcBot()
twitterBot.runInstance()
