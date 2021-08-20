import TwitterApi from 'twitter-api-v2';
import TwitterApiv1ReadWrite from 'twitter-api-v2/dist/v1/client.v1.write';
import TwitterApiv2ReadWrite from 'twitter-api-v2/dist/v2/client.v2.write';

import { getCurrentTime } from '../shared/Formatters';

export default class TwitterAPI {
  twitterV1: TwitterApiv1ReadWrite = null
  twitterV2: TwitterApiv2ReadWrite = null

  constructor(apiKey, apiSecretKey, accessToken, accessTokenSecret) {
    // Instantiate the TwitterAPI
    const twitterClient = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecretKey,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });

    this.twitterV1 = twitterClient.v1;
    this.twitterV2 = twitterClient.v2;
  }

  async postTweet(content) {
    try {
      const tweet = await this.twitterV1.tweet(content)
      console.log(`Tweet Posted @ ${getCurrentTime()}:`, `https://twitter.com/${tweet.user.screen_name}/status/${tweet.user.id_str}\n`)
    } catch (error) {
      console.log("Oops! Unable to post the Tweet.")
      console.log("Error:", error.message, '\n')
    }
  }

  async userMentionTimeline(userId: string) {
  }
}
