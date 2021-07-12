const Twit = require('twit');

class TwitterAPI {
  constructor(consumer_key, consumer_secret, access_token, access_token_secret) {
    this.consumer_key = consumer_key;
    this.consumer_secret = consumer_secret;
    this.access_token = access_token;
    this.access_token_secret = access_token_secret;

    this.api = new Twit({
      consumer_key: this.consumer_key,
      consumer_secret: this.consumer_secret,
      access_token: this.access_token,
      access_token_secret: this.access_token_secret,
      timeout_ms: 60 * 1000,
      strictSSL: true,
    });
  }

  postTweet(content) {
    this.api.post('statuses/update', { status: content }, function(err, data, response) {
      if (err != null) {
        console.log("Oops! Unable to post the Tweet:", err.allErrors[0] && err.allErrors[0].message)
      } else {
        console.log("Tweet posted!")
      }
    })
  }
}

class McBot {
  constructor() {
    this.asset_range = 10
  }

  runInstance() {
    console.log("Running McBot")

    const twitterAPI = new TwitterAPI(
      'H8uM5UikvJpbfBVyqwoNfK5au',
      'SJvPQ1lN18Cs1P58qryskzkp5DsnRO5tbyNy0i3Yuve7qoN6HU',
      '928651527383744512-m7XZP6R1sdEHRhIoT9gBRDwfoBflAAC',
      'ZuU67EVrrSuZDQiIM8RFl4QHanKr9ZMDAstCQOF5cYNT0'
    )

    twitterAPI.postTweet("I am building a Twitter bot that will tweets all NFT sales along with the profit/loss flip % for CryptoPunks, Bored Apes & Cool Cats.")
  }
}

const bot = new McBot()
bot.runInstance()
