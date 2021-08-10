import 'dotenv/config';

import TwitterAPI from '../../api/TwitterAPI';
import CoinbaseAPI from '../../api/CoinbaseAPI';

import { runDebugBot } from './DebugBot';
import { getCollectionsDataFromOpenSea } from './Helpers';

import { composeTweet } from '../Twitter';

import { Sale } from '../../types/OpenSeaSale';

import { getCurrentTime } from '../../shared/Formatters';

export default class NFTSalesBot {
  twitterAPI: TwitterAPI = null
  coinbaseAPI: CoinbaseAPI = null

  constructor() {
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

    const collectionsData = await getCollectionsDataFromOpenSea()
    console.log('\nCollections', collectionsData, '\n')

    let currentIndex = 0

    // Run in Production
    while(true) {
      // Get the index within the bounds of collectionData
      const collectionIndex = currentIndex % collectionsData.length
      const currentCollection = collectionsData[collectionIndex]

      if (currentCollection.oldSalesIds.length <= 0) {
        console.log(`Missing oldSalesIds for ${currentCollection.collection.name}`)

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
        console.log(`Unable to get new Sales Events for ${currentCollection.collection.name} @ ${getCurrentTime()}:`, error.message, "\n")

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
                      this.twitterAPI.postTweet(tweetText)
                    }
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
