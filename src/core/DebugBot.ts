import CoinbaseAPI from '../api/CoinbaseAPI';
import DearEarthAPI from '../api/DearEarthAPI';
import OpenSeaAPI from '../api/OpenSeaAPI';
import TwitterAPI from '../api/TwitterAPI';
import LooksRareAPI from '../api/LooksRareAPI';
import CoinMarketCapAPI from '../api/CoinMarketCapAPI';
import { composeTweet } from './Twitter';
import { getCollectionData } from './SalesBot';
import { composeLooksRareTweet } from './LooksRare';
import { CollectionSlug } from '../shared/Constants';
import { getCollectionFromSlug } from '../utils/OpenSea';
import { getCurrentUnixTimeMinusFifteenMinutes } from '../utils/DateTime';

export async function runDebugBot(
  openSeaAPI: OpenSeaAPI,
  coinbaseAPI: CoinbaseAPI,
  twitterAPI: TwitterAPI,
  dearEarthAPI: DearEarthAPI,
  looksRareAPI: LooksRareAPI,
  coinMarketCapAPI: CoinMarketCapAPI
) {
  // Get the Collection Data
  const collection = getCollectionFromSlug(CollectionSlug.alienfrensnft)
  const collectionData = await getCollectionData(collection, openSeaAPI, dearEarthAPI)
  const tokenID = 3630

  try {
    // Fetch transactions from OpenSeaAPI
    let tokenSales = await openSeaAPI.fetchSaleEventsForToken(collection.address, tokenID, 'successful')

    // Fetch transactions from LooksRareAPI
    const transactions = await looksRareAPI.fetchTransactions(getCurrentUnixTimeMinusFifteenMinutes())

    // Get a cryptocurrency quote from CoinMarketCapAPI
    const apeCoinData = await coinMarketCapAPI.getLatestQuote()
    // console.log(apeCoinData)
    
    // If only 1 sale exists, get the token mint sale event
    if (tokenSales.length < 2) {
      const transferEvents = await openSeaAPI.fetchSaleEventsForToken(collection.address, tokenID, 'transfer')

      const mintSale = transferEvents[transferEvents.length-1]
      tokenSales.push(mintSale)
    }

    try {
      if (transactions.length > 0) {
        console.log(`\nGot ${transactions.length} LooksRare Transctions in the last 15 mins`)
        // Post a tweet for LooksRare Transction
        const looksRareSaleTweet = await composeLooksRareTweet({ transaction: transactions[0], coinbaseAPI})
        await twitterAPI.postTweet(looksRareSaleTweet)
      } else {
        console.log(`\nNo LooksRare Transaction. Change the dateSince Unix timestamp`)
      }

      console.log('')

      // Post a tweet with sale information
      const newSalesTweet = await composeTweet({
        collection,
        purchase: tokenSales[1],
        sale: tokenSales[0],
        coinbaseAPI,
        floorPrice: collectionData.floorPrice
      })
      await twitterAPI.postTweet(newSalesTweet)
    } catch (error) {
      console.log(`Unable to post Tweet for ${collection.symbol} ${tokenID}:`, error.message)
    }
  } catch (error) {
    console.log(`Unable to get Sales Events for ${collection.symbol} #${tokenID}:`, error.message)
  }
};
