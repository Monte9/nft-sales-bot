import 'dotenv/config';

import TwitterAPI from '../../api/TwitterAPI';
import CoinbaseAPI from '../../api/CoinbaseAPI';
import OpenSeaAPI from '../../api/OpenSeaAPI';

import { runDebugBot } from './DebugBot';
import { getCollectionsDataFromOpenSea, getMentionsDataFromOpenSea } from './Helpers';

import { composeReply, composeTweet } from '../Twitter';

import { Sale } from '../../types/OpenSeaSale';

import { getCurrentTime } from '../../shared/Formatters';
import { TwitterMention } from '../../types/NFTSalesBot';
import { getCollectionFromSymbol, isError } from '../../shared/Helpers';
import { CollectionSymbol } from '../../shared/Constants';

export default class NFTSalesBot {
  twitterAPI: TwitterAPI = null
  coinbaseAPI: CoinbaseAPI = null
  openSeaAPI: OpenSeaAPI = null

  constructor() {
    this.coinbaseAPI = new CoinbaseAPI();
    
    this.twitterAPI = new TwitterAPI(
      process.env.TWITTER_API_KEY,
      process.env.TWITTER_API_SECRET_KEY,
      process.env.TWITTER_ACCESS_TOKEN,
      process.env.TWITTER_ACCESS_TOKEN_SECRET,
    )
  }

  async start() {
    console.log(`Starting NFT Sales Bot in ${process.env.NODE_ENV}\n`)

    // Runs the DebugBot in DEVELOPMENT environment
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      runDebugBot(this.coinbaseAPI, this.twitterAPI)
      return
    }

    const collectionsData = await getCollectionsDataFromOpenSea()
    console.log('\nCollections', collectionsData, '\n')

    const mentionsData = await getMentionsDataFromOpenSea(this.twitterAPI)
    console.log('\nMentions', mentionsData, '\n')

    let currentIndex = 0

    // TODO - remove this for OpenSeaAPI
    const collection = getCollectionFromSymbol(CollectionSymbol.BAYC);

    // TODO - remoe this for OpenSeaAPI
    this.openSeaAPI = new OpenSeaAPI(collection.address)

    // Run in Production
    while(true) {
      // let newMentions: TwitterMention[] = null;
      // let newMentionIds: string[] = []

      // try {
      //   newMentions = await this.twitterAPI.fetchParsedMentions();

      //   for (let i=0; i<newMentions.length; i++) {
      //     newMentionIds.push(newMentions[i].tweetId)
      //   }
      // } catch (error) {
      //   console.log(`Unable to get Twitter Mentions @ ${getCurrentTime()}:`, error.message, '\n')
      // }

      // let latestMentionIds: string[] = newMentionIds.filter(id => !mentionsData.oldMentionIds.includes(id))
      //   .concat(mentionsData.oldMentionIds.filter(id => !newMentionIds.includes(id)));

      // if (latestMentionIds.length < 1) {
      //   console.log(`${getCurrentTime()} - No new mentions!\n`)
      // } else {
      //   for (let i=0; i<latestMentionIds.length; i++) {
      //     const tweetMentionId = latestMentionIds[i]

      //     const mention = newMentions.find(mention => {
      //       if (mention.tweetId == tweetMentionId) {
      //         return true
      //       } else {
      //         return false
      //       }
      //     });

      //     if (mention) {
      //       console.log(`Got a mention from ${mention.author.username}: ${mention.text}`)
      //       console.log(`https://twitter.com/${mention.author.username}/status/${mention.tweetId}`)

      //       try {
      //         const tweetText = await composeReply(mention, this.openSeaAPI, this.coinbaseAPI)

      //         // In DEVELOPMENT environment we don't want to tweet it
      //         // Just console log the Tweet text
      //         if (process.env.NODE_ENV === "DEVELOPMENT") {
      //           console.log(tweetText)
      //         } else {
      //           await this.twitterAPI.postReply(tweetText, mention.tweetId)
      //         }
      //       } catch (error) {
      //         console.log('Unable to compose reply:', error.message)
      //       }
      //     }
      //   }
      // }

      // Get the index within the bounds of collectionData
      const collectionIndex = currentIndex % collectionsData.length
      const currentCollection = collectionsData[collectionIndex]

      if (currentCollection.oldSalesIds.length <= 0) {
        console.log(`Missing oldSalesIds for ${currentCollection.collection.name}`)

        // Delay the next OpenSea API call by 30 seconds
        console.log(`Waiting for 30 secs...\n`)
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Increment currentIndex to go to the next collection
        currentIndex = currentIndex + 1
        continue
      }

      let newSales: Sale[] = null;
      let newSalesIds: number[] = []

      console.log(`Getting sales events for ${currentCollection.collection.name}`)

      try {
        newSales = await currentCollection.openSeaAPI.fetchParsedSaleEvents()

        for (let i=0; i<newSales.length; i++) {
          newSalesIds.push(newSales[i].saleId)
        }
      } catch (error) {
        console.log(`Unable to get new sales events for ${currentCollection.collection.name} @ ${getCurrentTime()}:`, error.message, "\n")

        // Delay the next OpenSea API call by 30 seconds
        console.log(`Waiting for 30 secs...\n`)
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Increment currentIndex to got to the next collection
        currentIndex = currentIndex + 1
        continue
      }

      let latestSalesIds: number[] = newSalesIds.filter(id => !currentCollection.oldSalesIds.includes(id))
        .concat(currentCollection.oldSalesIds.filter(id => !newSalesIds.includes(id)));

      if (latestSalesIds.length < 1) {
        console.log(`${getCurrentTime()} - No new sales!\n`)
      } else {
        for (let i=0; i<latestSalesIds.length; i++) {
          console.log(`${currentCollection.collection.name} @ ${getCurrentTime()} - New Sale ID#${latestSalesIds[i]}\n`)

          for (let j=0; j<newSales.length; j++) {
            const tokenID = newSales[j].asset.tokenId

            if (latestSalesIds[i] === newSales[j].saleId) {
              try {
                const tokenSales = await currentCollection.openSeaAPI.fetchParsedSaleEvents(tokenID)

                if (tokenSales.length > 1) {
                  try {
                    const tweetText = await composeTweet({
                      collection: currentCollection.collection,
                      purchase: tokenSales[1], 
                      sale: tokenSales[0], 
                      coinbaseAPI: this.coinbaseAPI
                    })

                    // In DEVELOPMENT environment we don't want to tweet it
                    // Just console log the Tweet text
                    if (process.env.NODE_ENV === "DEVELOPMENT") {
                      console.log(tweetText)
                    } else {
                      await this.twitterAPI.postTweet(tweetText)
                    }
                  } catch (error) {
                    console.log("Unable to post tweet:", error.message)
                  }
                } else {
                  console.log(`${currentCollection.collection.name} #${tokenID} only has 1 Sales Event`, '\n')
                }
              } catch (error) {
                console.log(`Unable to get Sales Events for ${currentCollection.collection.name} #${tokenID}:`, error.message)

                // Delay the next OpenSea API call by 30 seconds
                console.log(`Waiting for 30 secs...\n`)
                await new Promise(resolve => setTimeout(resolve, 30000));

                // Increment currentIndex to got to the next collection
                currentIndex = currentIndex + 1
                continue
              }
            }
          }
        }
      }

      // Update the oldSalesIds to prevent duplicates in the next iteration
      currentCollection.oldSalesIds = newSalesIds

      // Update the oldMentionIds to prevet duplicate replies on Twitter
      mentionsData.oldMentionIds = newMentionIds

      // Delay the next OpenSea API call by 30 seconds
      console.log(`Waiting for 30 secs...\n`)
      await new Promise(resolve => setTimeout(resolve, 30000));

      // Increment currentIndex to got to the next collection
      currentIndex = currentIndex + 1
    }
  }
}
