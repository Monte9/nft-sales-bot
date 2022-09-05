import TwitterApi from 'twitter-api-v2'
import TwitterApiv1ReadWrite from 'twitter-api-v2/dist/v1/client.v1.write'
import TwitterApiv2ReadWrite from 'twitter-api-v2/dist/v2/client.v2.write'

import { IS_PRODUCTION } from '../shared/Constants'
import { getCurrentDateTime } from '../utils/DateTime'

export const MISSING_IMAGE_ID = 'missing_image_id'

export default class TwitterAPI {
  private twitterClientV1: TwitterApiv1ReadWrite
  private twitterClientV2: TwitterApiv2ReadWrite

  constructor(apiKey, apiSecretKey, accessToken, accessTokenSecret) {
    // Instantiate the TwitterAPI
    const twitterClient = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecretKey,
      accessToken: accessToken,
      accessSecret: accessTokenSecret
    })

    this.twitterClientV1 = twitterClient.v1
    this.twitterClientV2 = twitterClient.v2
  }

  // https://github.com/PLhery/node-twitter-api-v2/blob/cc79c6040d0b786b9ff1d93e3c73ad05bad08efe/src/types/v2/tweet.v2.types.ts
  // Users may attach up to four photos or one GIF, video, poll, or quote tweet without losing any characters.
  async postTweet(content: string, media_id?: string) {
    try {
      if (IS_PRODUCTION) {
        const media = media_id ? { media_ids: [media_id] } : undefined
        const { data: createdTweet } = await this.twitterClientV2.tweet(
          content,
          { media }
        )

        console.log(
          `Tweet Posted @ ${getCurrentDateTime()} CST:`,
          `https://twitter.com/dearearth_/status/${createdTweet.id}`
        )
      } else {
        const contentDebug = '\ncontent:\n' + content
        const media = media_id ? `\nmedia_id: ${media_id}` : ''

        console.log('Post Tweet', media, contentDebug, '\n')
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error posting tweet:', error.message)
    }
  }

  // https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/post-media-upload
  async uploadImage(filePath: string) {
    try {
      // Only upload image in Production
      if (IS_PRODUCTION) {
        return await this.twitterClientV1.uploadMedia(filePath)
      } else {
        return MISSING_IMAGE_ID
      }
    } catch (error: any) {
      console.error('Error uploading media to Twitter:', error.message)
    }
  }
}
