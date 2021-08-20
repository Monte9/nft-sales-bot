import OpenSeaAPI from "../api/OpenSeaAPI";

import { Collection } from "./OpenSeaSale";

export interface SalesBot {
  collection: Collection
  openSeaAPI: OpenSeaAPI
  oldSalesIds: number[]
}

export interface MentionsBot {
  oldMentionIds: string[]
}

export interface TwitterMention {
  authorId: string
  tweetId: string
  text: string
  author: TweetAuthor
}

export interface TweetAuthor {
  id: string
  username: string
  description: string
  name: string
}
