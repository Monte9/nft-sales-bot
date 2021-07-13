const OpenSeaAPI = require('./src/OpenSeaAPI');
const TwitterAPI = require('./src/TwitterAPI');

class TwitterMcBot {
  constructor() {
    this.asset_range = 10

    this.twitterAPI = new TwitterAPI(
      'H8uM5UikvJpbfBVyqwoNfK5au',
      'SJvPQ1lN18Cs1P58qryskzkp5DsnRO5tbyNy0i3Yuve7qoN6HU',
      '928651527383744512-m7XZP6R1sdEHRhIoT9gBRDwfoBflAAC',
      'ZuU67EVrrSuZDQiIM8RFl4QHanKr9ZMDAstCQOF5cYNT0'
    )

    this.openSeaAPI = new OpenSeaAPI();
  }

  async runInstance() {
    console.log("Running Twitter McBot")

    // Get latest events for the NFT
    let saleEvents = await this.openSeaAPI.getNFT()

    console.log(saleEvents)

    // Post a tweet
    // this.twitterAPI.postTweet("I am building a Twitter bot that will tweets all NFT sales along with the profit/loss flip % for CryptoPunks, Bored Apes & Cool Cats.")
  }
}

const twitterBot = new TwitterMcBot()
twitterBot.runInstance()
