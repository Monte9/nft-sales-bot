import TwitterApi from 'twitter-api-v2';
import TwitterApiv2ReadWrite from 'twitter-api-v2/dist/v2/client.v2.write';

import { IS_PRODUCTION } from '../shared/Constants';
import { getCurrentDateTime } from '../utils/DateTime';

export default class TwitterAPI {
  private twitterClientV2: TwitterApiv2ReadWrite

  constructor(apiKey, apiSecretKey, accessToken, accessTokenSecret) {
    // Instantiate the TwitterAPI
    const twitterClient = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecretKey,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });

    this.twitterClientV2 = twitterClient.v2;
  }

  async postTweet(content) {
    try {
      if (IS_PRODUCTION) {
        const tweet = await this.twitterClientV2.tweet(content)
        console.log(`Tweet Posted @ ${getCurrentDateTime()}:`, `https://twitter.com/dearearth_/status/${tweet.data.id}`)
      } else {
        // In DEVELOPMENT environment we don't want to post a tweet
        console.log(content)
      }
    } catch (error) {
      console.log("Error:", error.message)
    }
  }
}
