import 'dotenv/config';

import CoinbaseAPI from '../api/CoinbaseAPI';
import FloorAPI from '../api/FloorAPI';
import OpenSeaAPI from '../api/OpenSeaAPI';
import TwitterAPI from '../api/TwitterAPI';

import { runDebugBot } from './DebugBot';

import { composeTweet } from './Twitter';

import { Collection, CollectionSlug, Sale, SalesBot } from '../types';

import { getCurrentTime } from '../shared/Formatters';
import { NFT_COLLECTIONS } from '../shared/Constants';
import { assetBelongsToCollection, getFloorPriceForCollection } from '../shared/Helpers';

export default class NFTSalesBot {
  coinbaseAPI: CoinbaseAPI = null
  floorAPI: FloorAPI = null
  openSeaAPI: OpenSeaAPI = null
  twitterAPI: TwitterAPI = null

  constructor() {
    this.coinbaseAPI = new CoinbaseAPI();
    this.openSeaAPI = new OpenSeaAPI();
    this.floorAPI = new FloorAPI();

    this.twitterAPI = new TwitterAPI(
      process.env.TWITTER_API_KEY,
      process.env.TWITTER_API_SECRET_KEY,
      process.env.TWITTER_ACCESS_TOKEN,
      process.env.TWITTER_ACCESS_TOKEN_SECRET,
    );
  }

  async start() {
    console.log(`Starting NFT Sales Bot in ${process.env.NODE_ENV}\n`)

    // Runs DebugBot in DEVELOPMENT environment
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      runDebugBot(this.openSeaAPI, this.coinbaseAPI, this.twitterAPI, this.floorAPI)
      return
    }

    const collectionsData = await getCollectionsDataFromOpenSea(this.openSeaAPI)
    console.log('\Initial Collections', collectionsData, '\n')

    let currentIndex = 0

    // Loops through event collection
    // Gets new sale events from OpenSea API
    // Tweets about the sale using Twitter API
    // Wait for 30 seconds
    // Increments to the next collection
    while(true) {
      // Get the index within the bounds of collectionData
      const collectionIndex = currentIndex % collectionsData.length
      const currentCollection = collectionsData[collectionIndex]

      // -------- Step 1
      // Make sure we have oldSaleIds for the currect collection
      if (currentCollection.oldSalesIds.length <= 0) {
        console.log(`Missing oldSalesIds for ${currentCollection.collection.name}`)

        // Update the missing collection again
        collectionsData[collectionIndex] = await getCollectionData(currentCollection.collection, this.openSeaAPI)

        // Delay the next OpenSea API call by 30 seconds
        console.log(`Waiting for 30 secs...\n`)
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Increment currentIndex to go to the next collection
        currentIndex = currentIndex + 1
        continue
      }
      // -------- End of Step 1

      // -------- Step 2
      // Get the NEW sale events for the current collection
      let newSales: Sale[] = null;
      let newSalesIds: number[] = []

      console.log(`Getting sales events for ${currentCollection.collection.name}`)
      try {
        newSales = await this.openSeaAPI.fetchSaleEventsForCollection(currentCollection.collection.slug)

        newSales.map(newSale => {
          newSalesIds.push(newSale.saleId)
        })
      } catch (error) {
        console.log(`Unable to get new sales events for ${currentCollection.collection.symbol} @ ${getCurrentTime()}:`, error.message, "\n")

        // Delay the next OpenSea API call by 30 seconds
        console.log(`Waiting for 30 secs...\n`)
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Increment currentIndex to got to the next collection
        currentIndex = currentIndex + 1
        continue
      }
      // -------- End of Step 2

      // -------- Step 3
      // Get the LATEST sale events for the current collection
      // If not events found, go to next collection
      let latestSalesIds: number[] = newSalesIds.filter(id => !currentCollection.oldSalesIds.includes(id))
        .concat(currentCollection.oldSalesIds.filter(id => !newSalesIds.includes(id)));

      if (latestSalesIds.length < 1) {
        console.log(`${getCurrentTime()} - No new sales!\n`)

        // Update the oldSalesIds to prevent duplicates in the next iteration
        currentCollection.oldSalesIds = newSalesIds

        // Delay the next OpenSea API call by 30 seconds
        console.log(`Waiting for 30 secs...\n`)
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Increment currentIndex to got to the next collection
        currentIndex = currentIndex + 1
        continue
      }
      // -------- End of Step 3

      // -------- Step 4
      // Loops through each latest sale event and tweets it
      for (let i=0; i<latestSalesIds.length; i++) {

        for (let j=0; j<newSales.length; j++) {
          const asset = newSales[j].asset
          const tokenID = asset.tokenId

          // Make sure the latest sale ID is part of the new sales array
          if (latestSalesIds[i] === newSales[j].saleId) {
            console.log(`${currentCollection.collection.name} @ ${getCurrentTime()} - New Sale ID#${latestSalesIds[i]}\n`)

            // We want to be selective about which artblocks we support
            if (currentCollection.collection.slug == CollectionSlug.artblocks) {
              if (!assetBelongsToCollection(currentCollection.collection, asset.name)) {
                console.log(`${currentCollection.collection.symbol} #${tokenID} is ${asset.name} and is not supported`, '\n')
                continue
              }
            }

            // Fetches all the sale events for the token
            try {
              const tokenSales = await this.openSeaAPI.fetchSaleEventsForToken(currentCollection.collection.address, tokenID)

              // If only 1 sale exists, it's not considered a FLIP - just ignore it
              if (tokenSales.length < 2) {
                console.log(`${currentCollection.collection.symbol} #${tokenID} only has 1 sales event`, '\n')
                continue
              }

              try {
                const tweetText = await composeTweet({
                  collection: currentCollection.collection,
                  purchase: tokenSales[1],
                  sale: tokenSales[0],
                  coinbaseAPI: this.coinbaseAPI,
                  floorPrice: currentCollection.floorPrice
                })

                // Post a tweet with sale information
                await this.twitterAPI.postTweet(tweetText)
              } catch (error) {
                console.log("Unable to post tweet:", error.message)
              }
            } catch (error) {
              console.log(`Unable to get Sales Events for ${currentCollection.collection.symbol} #${tokenID}:`, error.message)

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
      // -------- End of Step 4

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

// Gets the oldSales events for all Collections
// Used to initialize the bot and build a Collection object
export async function getCollectionsDataFromOpenSea(openSeaAPI: OpenSeaAPI): Promise<SalesBot[]> {
  return await Promise.all(
    NFT_COLLECTIONS.map(async (collection): Promise<SalesBot> => {
      return getCollectionData(collection, openSeaAPI)
    })
  )
}

// Gets the oldSales events for all Collections
// Used to initialize the bot and build a Collection object
export async function getCollectionData(collection: Collection, openSeaAPI: OpenSeaAPI): Promise<SalesBot> {
  let oldSales: Sale[] = null;
  let oldSalesIds: number[] = []

  let salesBot: SalesBot = {
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

  // Set the floor price for the collection
  const floorPrice = await getFloorPriceForCollection(collection)
  salesBot.floorPrice = floorPrice.currentFloor

  // Update the oldSalesId on the salesBot
  salesBot.oldSalesIds = oldSalesIds
  return salesBot
}
