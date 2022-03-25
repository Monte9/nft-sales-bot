import 'dotenv/config';

import CoinbaseAPI from '../api/CoinbaseAPI';
import FloorAPI from '../api/FloorAPI';
import DearEarthAPI from '../api/DearEarthAPI';
import OpenSeaAPI from '../api/OpenSeaAPI';
import TwitterAPI from '../api/TwitterAPI';
import LooksRareAPI from '../api/LooksRareAPI';
import CoinMarketCapAPI from '../api/CoinMarketCapAPI';
import { runDebugBot } from './DebugBot';
import { getProfitThresholdETH } from './SaleData';
import { composeTweet } from './Twitter';
import { composeLooksRareTweet } from './LooksRare';
import { ACTIVE_NFT_COLLECTIONS, IS_PRODUCTION } from '../shared/Constants';
import { getCurrentDateTime, getCurrentUnixTimeMinusFifteenMinutes } from '../utils/DateTime';
import { getFloorPriceForCollection } from '../utils/OpenSea';
import { rounded } from '../utils/Number';
import { Collection, Sale, SalesBot } from '../types';

export default class NFTSalesBot {
  coinbaseAPI: CoinbaseAPI = null
  floorAPI: FloorAPI = null
  openSeaAPI: OpenSeaAPI = null
  twitterAPI: TwitterAPI = null
  dearEarthAPI: DearEarthAPI = null
  looksRareAPI: LooksRareAPI = null
  coinMarketCapAPI: CoinMarketCapAPI = null

  constructor() {
    this.coinbaseAPI = new CoinbaseAPI();
    this.openSeaAPI = new OpenSeaAPI();
    this.floorAPI = new FloorAPI();
    this.dearEarthAPI = new DearEarthAPI();
    this.looksRareAPI = new LooksRareAPI();
    this.coinMarketCapAPI = new CoinMarketCapAPI();

    this.twitterAPI = new TwitterAPI(
      process.env.TWITTER_API_KEY,
      process.env.TWITTER_API_SECRET_KEY,
      process.env.TWITTER_ACCESS_TOKEN,
      process.env.TWITTER_ACCESS_TOKEN_SECRET,
    );
  }

  async start() {
    console.log(`Starting NFT Sales Bot in production: ${IS_PRODUCTION}`)

    // Run debug bot if it's not in production
    if (!IS_PRODUCTION) {
      runDebugBot(this.openSeaAPI, this.coinbaseAPI, this.twitterAPI, this.dearEarthAPI, this.looksRareAPI, this.coinMarketCapAPI)
      return
    }

    const collectionsData = await getCollectionsDataFromOpenSea(this.openSeaAPI, this.dearEarthAPI)
    console.log('\Initial Collections', collectionsData)

    let currentIndex = 0
    let shouldFetchLooksRareTransactions = true

    // Loops through event collection
    // Gets new sale events from OpenSea API
    // Tweets about the sale using Twitter API
    // Wait for 30 seconds
    // Increments to the next collection
    while(true) {
      // Get the index within the bounds of collectionData
      const collectionIndex = currentIndex % collectionsData.length
      const currentCollection = collectionsData[collectionIndex]

      // Date Time data for LooksRare API
      const dateTime = getCurrentDateTime('YYYY-MM-DDTHH:mm')
      const formattedDateTime = getCurrentDateTime()
      const hourMark = dateTime.split(':')[1]

      // 5 mins before the 15 mins mark, toggle the shouldFetchLooksRareTransactions bool value
      if (shouldFetchLooksRareTransactions === false && (hourMark === '55' || hourMark === '10' || hourMark === '25' || hourMark === '40')) {
        shouldFetchLooksRareTransactions = true
        console.log(`LooksRare API Transactions @ ${formattedDateTime} - shouldFetchLooksRareTransactions: ${shouldFetchLooksRareTransactions}`)
      }

      // Get LooksRare Transactions every 15 mins
      if (shouldFetchLooksRareTransactions && (hourMark === '00' || hourMark === '15' || hourMark === '30' || hourMark === '45')) {
        shouldFetchLooksRareTransactions = false
        console.log(`LooksRare API Transactions @ ${formattedDateTime} - shouldFetchLooksRareTransactions: ${shouldFetchLooksRareTransactions}`)

        try {
          // Fetch transactions from LooksRareAPI
          const transactions = await this.looksRareAPI.fetchTransactions(getCurrentUnixTimeMinusFifteenMinutes())
          console.log(`LooksRare API Transactions @ ${formattedDateTime} since ${getCurrentUnixTimeMinusFifteenMinutes()}: ${transactions.length}`)

          await Promise.all(
            transactions.map(async transaction => {
              try {
                // Post a tweet for LooksRare Transction
                const looksRareSaleTweet = await composeLooksRareTweet({ transaction: transaction, coinbaseAPI: this.coinbaseAPI})
                return await this.twitterAPI.postTweet(looksRareSaleTweet)
              } catch (error) {
                console.log(`Unable to post Tweet for LooksRare collection ${transaction.collection.id}/${transaction.tokenId}:`, error.message)
              }
            })
          )

          continue
        } catch (error) {
          console.log(`Unable to get Sales Events for LooksRare API:`, error.message)
          continue
        }
      }

      if (!currentCollection) {
        // Delay the next OpenSea API call by 30 seconds
        console.log(`Waiting for 30 secs...`)
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Increment currentIndex to got to the next collection
        currentIndex = currentIndex + 1
        continue
      }

      // -------- Step 1
      // Make sure we have oldSaleIds for the currect collection
      if (currentCollection.oldSalesIds.length <= 0) {
        console.log(`Missing oldSalesIds for ${currentCollection.collection.name}`)

        // Update the missing collection again
        collectionsData[collectionIndex] = await getCollectionData(currentCollection.collection, this.openSeaAPI, this.dearEarthAPI)

        // Delay the next OpenSea API call by 30 seconds
        console.log(`Waiting for 30 secs...`)
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
          newSalesIds.push(newSale.openseaSaleId)
        })
      } catch (error) {
        console.log(`Unable to get new sales events for ${currentCollection.collection.symbol} @ ${getCurrentDateTime()}:`, error.message)

        // Delay the next OpenSea API call by 30 seconds
        console.log(`Waiting for 30 secs...`)
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
        console.log(`${getCurrentDateTime()} - No new sales!`)

        // Update the oldSalesIds to prevent duplicates in the next iteration
        currentCollection.oldSalesIds = newSalesIds

        // Delay the next OpenSea API call by 30 seconds
        console.log(`Waiting for 30 secs...`)
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
          const tokenID = Number(asset.tokenId)

          // Make sure the latest sale ID is part of the new sales array
          if (latestSalesIds[i] === newSales[j].openseaSaleId) {
            console.log(`${currentCollection.collection.name} @ ${getCurrentDateTime()} - New Sale ID#${latestSalesIds[i]}`)

            // Fetches all the sale events for the token
            try {
              const tokenSales = await this.openSeaAPI.fetchSaleEventsForToken(currentCollection.collection.address, tokenID)

              // If only 1 sale exists, get the token mint sale event
              if (tokenSales.length < 2) {
                const transferEvents = await this.openSeaAPI.fetchSaleEventsForToken(currentCollection.collection.address, tokenID, 'transfer')

                const mintSale = transferEvents[transferEvents.length-1]
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

                // Post a tweet with sale information
                await this.twitterAPI.postTweet(tweetText)
              } catch (error) {
                console.log(`Unable to post Tweet for ${currentCollection.collection.symbol} ${tokenID}:`, error.message)
              }
            } catch (error) {
              console.log(`Unable to get Sales Events for ${currentCollection.collection.symbol} #${tokenID}:`, error.message)

              // Delay the next OpenSea API call by 30 seconds
              console.log(`Waiting for 30 secs...`)
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
      console.log(`Waiting for 30 secs...`)
      await new Promise(resolve => setTimeout(resolve, 30000));

      // Increment currentIndex to got to the next collection
      currentIndex = currentIndex + 1
    }
  }
}

// Gets the oldSales events for all Collections
// Used to initialize the bot and build a Collection object
export async function getCollectionsDataFromOpenSea(openSeaAPI: OpenSeaAPI, dearEarthAPI: DearEarthAPI): Promise<SalesBot[]> {
  return await Promise.all(
    ACTIVE_NFT_COLLECTIONS.map(async (collection): Promise<SalesBot> => {
      return getCollectionData(collection, openSeaAPI, dearEarthAPI)
    })
  )
}

// Gets the oldSales events for all Collections
// Used to initialize the bot and build a Collection object
export async function getCollectionData(collection: Collection, openSeaAPI: OpenSeaAPI, dearEarthAPI: DearEarthAPI): Promise<SalesBot> {
  let oldSales: Sale[] = null;
  let oldSalesIds: number[] = []

  let salesBot: SalesBot = {
    collection,
    oldSalesIds
  }

  try {
    oldSales = await openSeaAPI.fetchSaleEventsForCollection(collection.slug)
    for (let i=0; i<oldSales.length; i++) {
      oldSalesIds.push(oldSales[i].openseaSaleId)
    }

    console.log(`Got ${oldSales.length} sales events for ${collection.slug}`)
  } catch (error) {
    return salesBot
  }

  // Update the oldSalesId on the salesBot
  salesBot.oldSalesIds = oldSalesIds

  // Set the floor price for the collection
  const floorPrice = await getFloorPriceForCollection(collection)
  const currentFloorPrice = rounded(floorPrice.currentFloor || 0)
  salesBot.floorPrice = currentFloorPrice

  // Calculate the profit threshold for the collection
  const profitThreshold = getProfitThresholdETH(currentFloorPrice)

  // Save the Sale in the DearEarth database
  await dearEarthAPI.saveCollectionData(collection, currentFloorPrice, profitThreshold)

  // Return the salesBot data
  return salesBot
}
