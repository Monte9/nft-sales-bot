import 'dotenv/config'

import CoinbaseAPI from '../api/CoinbaseAPI'
import FloorAPI from '../api/FloorAPI'
import OpenSeaAPI from '../api/OpenSeaAPI'
import TwitterAPI from '../api/TwitterAPI'
import { runDebugBot } from './DebugBot'
import { composeTweet } from './Twitter'
import { IS_PRODUCTION } from '../shared/Constants'
import { ALLOWLISTED_COLLECTIONS } from '../shared/Allowlist'
import { getCurrentDateTime } from '../utils/DateTime'
import { getFloorPriceForCollection } from '../utils/OpenSea'
import { rounded } from '../utils/Number'
import { Collection, Sale, SalesBot } from '../types'
import { cleanupDownloadedImages, downloadImage } from '../utils/Image'

export default class NFTSalesBot {
  coinbaseAPI: CoinbaseAPI = null
  floorAPI: FloorAPI = null
  openSeaAPI: OpenSeaAPI = null
  twitterAPI: TwitterAPI = null

  constructor() {
    this.coinbaseAPI = new CoinbaseAPI()
    this.openSeaAPI = new OpenSeaAPI()
    this.floorAPI = new FloorAPI()

    this.twitterAPI = new TwitterAPI(
      process.env.TWITTER_API_KEY,
      process.env.TWITTER_API_SECRET_KEY,
      process.env.TWITTER_ACCESS_TOKEN,
      process.env.TWITTER_ACCESS_TOKEN_SECRET
    )
  }

  async start() {
    console.log(`Starting NFT Sales Bot in production: ${IS_PRODUCTION}`)

    // Run debug bot if it's not in production
    if (!IS_PRODUCTION) {
      runDebugBot(this.openSeaAPI, this.coinbaseAPI, this.twitterAPI)
      return
    }

    const collectionsData = await getCollectionsDataFromOpenSea(this.openSeaAPI)

    let currentIndex = 0

    // Loops through event collection
    // Gets new sale events from OpenSea API
    // Tweets about the sale using Twitter API
    // Wait for 30 seconds
    // Increments to the next collection
    while (true) {
      // Get the index within the bounds of collectionData
      const collectionIndex = currentIndex % collectionsData.length
      const currentCollection = collectionsData[collectionIndex]

      // The file path of the downloaded collection image
      let filePath = undefined

      if (!currentCollection) {
        // Delay the next OpenSea API call by 30 seconds
        await new Promise((resolve) => setTimeout(resolve, 30000))

        // Increment currentIndex to got to the next collection
        currentIndex = currentIndex + 1
        continue
      }

      // -------- Step 1
      // Make sure we have oldSaleIds for the currect collection
      if (currentCollection.oldSalesIds.length <= 0) {
        // Update the missing collection again
        collectionsData[collectionIndex] = await getCollectionData(
          currentCollection.collection,
          this.openSeaAPI
        )

        // Delay the next OpenSea API call by 30 seconds
        await new Promise((resolve) => setTimeout(resolve, 30000))

        // Increment currentIndex to go to the next collection
        currentIndex = currentIndex + 1
        continue
      }
      // -------- End of Step 1

      // -------- Step 2
      // Get the NEW sale events for the current collection
      let newSales: Sale[] = null
      const newSalesIds: number[] = []

      try {
        newSales = await this.openSeaAPI.fetchSaleEventsForCollection(
          currentCollection.collection.slug
        )

        newSales.map((newSale) => {
          newSalesIds.push(newSale.openseaSaleId)
        })
      } catch (error) {
        console.error(
          `Unable to get new sales events for ${
            currentCollection.collection.symbol
          } @ ${getCurrentDateTime()}:`,
          error.message
        )

        // Delay the next OpenSea API call by 30 seconds
        await new Promise((resolve) => setTimeout(resolve, 30000))

        // Increment currentIndex to got to the next collection
        currentIndex = currentIndex + 1
        continue
      }
      // -------- End of Step 2

      // -------- Step 3
      // Get the LATEST sale events for the current collection
      // If not events found, go to next collection
      const latestSalesIds: number[] = newSalesIds
        .filter((id) => !currentCollection.oldSalesIds.includes(id))
        .concat(
          currentCollection.oldSalesIds.filter(
            (id) => !newSalesIds.includes(id)
          )
        )

      if (latestSalesIds.length < 1) {
        // Update the oldSalesIds to prevent duplicates in the next iteration
        currentCollection.oldSalesIds = newSalesIds

        // Delay the next OpenSea API call by 30 seconds
        await new Promise((resolve) => setTimeout(resolve, 30000))

        // Increment currentIndex to got to the next collection
        currentIndex = currentIndex + 1
        continue
      }
      // -------- End of Step 3

      // -------- Step 4
      // Loops through each latest sale event and tweets it
      for (let i = 0; i < latestSalesIds.length; i++) {
        for (let j = 0; j < newSales.length; j++) {
          const asset = newSales[j].asset
          const tokenId = Number(asset.tokenId)

          // Make sure the latest sale ID is part of the new sales array
          if (latestSalesIds[i] === newSales[j].openseaSaleId) {
            console.log(
              `New Sale ID# ${latestSalesIds[i]} @ ${getCurrentDateTime()} - ${
                currentCollection.collection.symbol
              } #${tokenId}`
            )

            // Fetches all the sale events for the token
            try {
              const tokenSales = await this.openSeaAPI.fetchSaleEventsForToken(
                currentCollection.collection.address,
                tokenId
              )

              // If only 1 sale exists, get the token mint sale event
              if (tokenSales.length < 2) {
                const transferEvents =
                  await this.openSeaAPI.fetchSaleEventsForToken(
                    currentCollection.collection.address,
                    tokenId,
                    'transfer'
                  )

                const mintSale = transferEvents[transferEvents.length - 1]
                tokenSales.push(mintSale)
              }

              try {
                const tweetText = await composeTweet({
                  collection: currentCollection.collection,
                  purchase: tokenSales[1],
                  sale: tokenSales[0],
                  coinbaseAPI: this.coinbaseAPI,
                  floorPrice: currentCollection.floorPrice
                })

                // This is the twitter mediaId that we'll include with the tweet
                let mediaId = undefined

                try {
                  // Download the collection image to the file path
                  filePath = await downloadImage(
                    tokenSales[0].asset.image,
                    tokenSales[0].asset.collection.slug
                  )

                  // Upload the collection image to Twitter
                  // get a Twitter mediaId to include in the tweet
                  mediaId = await this.twitterAPI.uploadImage(filePath)
                } catch (error) {
                  console.error(
                    `Oops! Unable to download image from ${tokenSales[0].asset.image}\n`
                  )
                }

                // Post a tweet with sale information
                await this.twitterAPI.postTweet(
                  tweetText,
                  mediaId,
                  currentCollection.collection.symbol,
                  tokenId
                )
              } catch (error) {
                console.error(
                  `Unable to post Tweet for ${currentCollection.collection.symbol} ${tokenId}:`,
                  error.message
                )
              } finally {
                // If file path exists, then go ahead and delete it
                if (filePath) {
                  await cleanupDownloadedImages([filePath])
                  filePath = undefined
                }
              }
            } catch (error) {
              console.error(
                `Unable to get Sales Events for ${currentCollection.collection.symbol} #${tokenId}:`,
                error.message
              )

              // Delay the next OpenSea API call by 30 seconds
              await new Promise((resolve) => setTimeout(resolve, 30000))

              // Increment currentIndex to got to the next collection
              currentIndex = currentIndex + 1
              continue
            }
          }
        }
      }
      // -------- End of Step 4

      // Update the oldSalesIds to prevent duplicates in the next iteration
      currentCollection.oldSalesIds = newSalesIds

      // Delay the next OpenSea API call by 30 seconds
      await new Promise((resolve) => setTimeout(resolve, 30000))

      // Increment currentIndex to got to the next collection
      currentIndex = currentIndex + 1
    }
  }
}

// Gets the oldSales events for all Collections
// Used to initialize the bot and build a Collection object
export async function getCollectionsDataFromOpenSea(
  openSeaAPI: OpenSeaAPI
): Promise<SalesBot[]> {
  return await Promise.all(
    ALLOWLISTED_COLLECTIONS.map(async (collection): Promise<SalesBot> => {
      return getCollectionData(collection, openSeaAPI)
    })
  )
}

// Gets the oldSales events for all Collections
// Used to initialize the bot and build a Collection object
export async function getCollectionData(
  collection: Collection,
  openSeaAPI: OpenSeaAPI
): Promise<SalesBot> {
  let oldSales: Sale[] = null
  const oldSalesIds: number[] = []

  const salesBot: SalesBot = {
    collection,
    oldSalesIds
  }

  try {
    oldSales = await openSeaAPI.fetchSaleEventsForCollection(collection.slug)
    for (let i = 0; i < oldSales.length; i++) {
      oldSalesIds.push(oldSales[i].openseaSaleId)
    }
  } catch (error) {
    return salesBot
  }

  // Update the oldSalesId on the salesBot
  salesBot.oldSalesIds = oldSalesIds

  // Set the floor price for the collection
  const floorPrice = await getFloorPriceForCollection(collection)
  const currentFloorPrice = rounded(floorPrice.currentFloor || 0)
  salesBot.floorPrice = currentFloorPrice

  // Return the salesBot data
  return salesBot
}
