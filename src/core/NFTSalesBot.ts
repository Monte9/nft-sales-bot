import 'dotenv/config';

import TwitterAPI from '../api/TwitterAPI';
import CoinbaseAPI from '../api/CoinbaseAPI';
import OpenSeaAPI from '../api/OpenSeaAPI';

import { runDebugBot } from './DebugBot';

import { composeTweet } from './Twitter';

import { Sale, SalesBot } from '../types';

import { getCurrentTime } from '../shared/Formatters';
import { NFT_COLLECTIONS } from '../shared/Constants';

export default class NFTSalesBot {
  twitterAPI: TwitterAPI = null
  coinbaseAPI: CoinbaseAPI = null
  openSeaAPI: OpenSeaAPI = null

  constructor() {
    this.coinbaseAPI = new CoinbaseAPI();
    this.openSeaAPI = new OpenSeaAPI();

    this.twitterAPI = new TwitterAPI(
      process.env.TWITTER_API_KEY,
      process.env.TWITTER_API_SECRET_KEY,
      process.env.TWITTER_ACCESS_TOKEN,
      process.env.TWITTER_ACCESS_TOKEN_SECRET,
    );
  }

  async start() {
    console.log(`Starting NFT Sales Bot in ${process.env.NODE_ENV}\n`)

    // Runs the DebugBot in DEVELOPMENT environment
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      runDebugBot(this.openSeaAPI, this.coinbaseAPI)
      return
    }

    const collectionsData = await getCollectionsDataFromOpenSea(this.openSeaAPI)
    console.log('\nCollections', collectionsData, '\n')

    let currentIndex = 0

    // Run in Production
    while(true) {
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
        newSales = await this.openSeaAPI.fetchSaleEventsForCollection(currentCollection.collection.slug)

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
                const tokenSales = await this.openSeaAPI.fetchSaleEventsForToken(currentCollection.collection.address, tokenID)

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

      // Delay the next OpenSea API call by 30 seconds
      console.log(`Waiting for 30 secs...\n`)
      await new Promise(resolve => setTimeout(resolve, 30000));

      // Increment currentIndex to got to the next collection
      currentIndex = currentIndex + 1
    }
  }
}

export async function getCollectionsDataFromOpenSea(openSeaAPI: OpenSeaAPI): Promise<SalesBot[]> {
  return await Promise.all(
    NFT_COLLECTIONS.map(async (collection): Promise<SalesBot | null> => {
      let oldSales: Sale[] = null;
      let oldSalesIds: number[] = []
  
      let salesBot = {
        collection,
        oldSalesIds
      }
  
      try {
        oldSales = await openSeaAPI.fetchSaleEventsForCollection(collection.slug)
        
        for (let i=0; i<oldSales.length; i++) {
          oldSalesIds.push(oldSales[i].saleId)
        }
  
        console.log(`Got ${oldSales.length} sales events for ${collection.slug}`)
      } catch (error) {
        console.log(`Unable to get sale events for ${collection.slug}:`, error.message, '\n')
        return salesBot
      }
  
      // Update the oldSalesId on the salesBot
      salesBot.oldSalesIds = oldSalesIds
      return salesBot
    })
  )
}
