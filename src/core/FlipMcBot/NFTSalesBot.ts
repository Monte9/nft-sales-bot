import 'dotenv/config';

import OpenSeaAPI from '../../api/OpenSeaAPI';
import TwitterAPI from '../../api/TwitterAPI';
import CoinbaseAPI from '../../api/CoinbaseAPI';

import { composeTweet } from '../Twitter';

import { Sale } from '../../types/OpenSeaSale';
import { SalesBot } from '../../types/NFTSalesBot';

import { getCurrentTime } from '../../shared/Formatters';
import { NFT_COLLECTIONS } from '../../shared/Constants';
import { runDebugBot } from './DebugBot';

export default class NFTSalesBot {
  twitterAPI: TwitterAPI = null
  coinbaseAPI: CoinbaseAPI = null

  constructor() {
    // Initialize TwitterAPI with API keys
    this.twitterAPI = new TwitterAPI(
      process.env.TWITTER_API_KEY,
      process.env.TWITTER_API_SECRET_KEY,
      process.env.TWITTER_ACCESS_TOKEN,
      process.env.TWITTER_ACCESS_TOKEN_SECRET,
    )

    this.coinbaseAPI = new CoinbaseAPI();
  }

  async start() {
    console.log(`Starting NFT Sales Bot in ${process.env.NODE_ENV}\n`)

    // Runs the DebugBot in DEVELOPMENT environment
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      runDebugBot(this.coinbaseAPI)
      return
    }

    let collectionsData: SalesBot[] = await Promise.all(
      NFT_COLLECTIONS.map(async (collection): Promise<SalesBot | null> => {
        const openSeaAPI = new OpenSeaAPI(collection.address)
        let oldSales: Sale[] = null;
        let oldSalesIds: number[] = []

        let salesBot = {
          collection,
          openSeaAPI,
          oldSalesIds
        }

        try {
          oldSales = await openSeaAPI.fetchParsedSaleEvents()
          
          for (let i=0; i<oldSales.length; i++) {
            oldSalesIds.push(oldSales[i].saleId)
          }

          console.log(`Got ${oldSales.length} Sales Events for ${collection.name}`)
        } catch (error) {
          console.log(`Unable to get ${collection.slug} Sales Events:`, error.message, '\n')
          return salesBot
        }

        // Update the oldSalesId on the salesBot
        salesBot.oldSalesIds = oldSalesIds
        return salesBot
      })
    )

    console.log('\nCollection Data', collectionsData, '\n')

    let currentIndex = 0

    // Run in Production
    while(true) {
      // Get the index within the bounds of collectionData
      const collectionIndex = currentIndex % collectionsData.length
      const currentCollection = collectionsData[collectionIndex]

      if (currentCollection.oldSalesIds.length <= 0) {
        console.log(`Missing oldSalesIds for ${currentCollection.collection.name}`)

        // Increment currentIndex to got to the next collection
        currentIndex = currentIndex + 1
        continue
      }

      let newSales: Sale[] = null;
      let newSalesIds: number[] = []

      console.log(`Getting events for ${currentCollection.collection.name}`)

      try {
        newSales = await currentCollection.openSeaAPI.fetchParsedSaleEvents()

        for (let i=0; i<newSales.length; i++) {
          newSalesIds.push(newSales[i].saleId)
        }
      } catch (error) {
        console.log(`Unable to get new Sales Events for ${currentCollection.collection.name} @ ${getCurrentTime()}:`, error.message, "\n")

        // Increment currentIndex to got to the next collection
        currentIndex = currentIndex + 1
        continue
      }

      let latestSalesIds: number[] = newSalesIds.filter(id => !currentCollection.oldSalesIds.includes(id))
        .concat(currentCollection.oldSalesIds.filter(id => !newSalesIds.includes(id)));

      if (latestSalesIds.length > 0) {
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
                    this.twitterAPI.postTweet(tweetText)
                    // console.log(tweetText)
                  } catch (error) {
                    console.log("Unable to post Tweet:", error.message)
                  }
                } else {
                  console.log(`${currentCollection.collection.name} #${tokenID} only has 1 Sales Event`, '\n')
                }
              } catch (error) {
                console.log(`Unable to get Sales Events for ${currentCollection.collection.name} #${tokenID}:`, error.message)

                // Increment currentIndex to got to the next collection
                currentIndex = currentIndex + 1
                continue
              }
            }
          }
        }
      } else {
        console.log(`${getCurrentTime()} - No new sales!\n`)
      }

      // Update the oldSalesIds to prevent duplicates in the next iteration
      currentCollection.oldSalesIds = newSalesIds

      // Delay the OpenSea API call by 30 seconds
      console.log(`Waiting for 30 secs...\n`)
      await new Promise(resolve => setTimeout(resolve, 30000));

      // Increment currentIndex to got to the next collection
      currentIndex = currentIndex + 1
    }
  }
}
