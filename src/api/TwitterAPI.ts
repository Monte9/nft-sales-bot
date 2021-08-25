import TwitterApi, { Tweetv2TimelineResult } from 'twitter-api-v2';
import TwitterApiv1ReadWrite from 'twitter-api-v2/dist/v1/client.v1.write';
import TwitterApiv2ReadWrite from 'twitter-api-v2/dist/v2/client.v2.write';

import { parseMentions } from '../core/Twitter';

import { TwitterMention } from '../types/NFTSalesBot';

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
      console.log(`Tweet Posted @ ${getCurrentTime()}:`, `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}\n`)
    } catch (error) {
      console.log("Oops! Unable to post the Tweet.")
      console.log("Error:", error.message, '\n')
    }
  }

  async postReply(content, sourceTweetStatusId) {
    try {
      const tweet = await this.twitterV1.reply(content, sourceTweetStatusId)
      console.log(`Reply Posted @ ${getCurrentTime()}:`, `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}\n`)
    } catch (error) {
      console.log("Oops! Unable to post the Reply.")
      console.log("Error:", error.message, '\n')
    }
  }

  async fetchParsedMentions(): Promise<TwitterMention[]> {
    let mentions = null

    // Get all mentions from Twitter
    try {
      mentions = await this.userMentionTimeline()
    } catch (error) {
      throw error
    }

    // If there are no mentions returned - throw an error
    if (mentions == null || mentions.length < 1) {
      throw new Error(`No recent mentions on Twitter`)
    }

    return parseMentions(mentions)
  }

  async userMentionTimeline(): Promise<Tweetv2TimelineResult> {
    try {
      const tweet = await this.twitterV2.userByUsername('nftsalesbot')
      const userId = tweet.data.id

      const response = await this.twitterV2.userMentionTimeline(userId, {expansions: ['author_id'], max_results: 20, "user.fields": ['username', 'description', 'name']})
      return response.data
    } catch (error) {
      console.log("Oops! Unable to recent mentions for nftsalesbot on Twitter.")
      console.log("Error:", error.message, '\n')
      throw(error.message);
    }
  }
}
