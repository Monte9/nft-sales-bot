import CoinbaseAPI from '../api/CoinbaseAPI';
import DearEarthAPI from '../api/DearEarthAPI';
import LeaderboardAPI from '../api/LeaderboardAPI';
import OpenSeaAPI from '../api/OpenSeaAPI';
import TwitterAPI from '../api/TwitterAPI';

import { composeTweet } from './Twitter';
import { getCollectionData } from './SalesBot';

import { CollectionSlug } from '../shared/Constants';

import { getCollectionFromSlug } from '../shared/Helpers';

export async function runDebugBot(openSeaAPI: OpenSeaAPI, coinbaseAPI: CoinbaseAPI, twitterAPI: TwitterAPI, leaderboardAPI: LeaderboardAPI) {
  // Get the Collection Data
  const collection = getCollectionFromSlug(CollectionSlug.boredapeyachtclub)
  const collectionData = await getCollectionData(collection, openSeaAPI, leaderboardAPI)
  const tokenID = 2402

  const dearEarthAPI = new DearEarthAPI();
  dearEarthAPI.fetchCollections();

  try {
    let tokenSales = await openSeaAPI.fetchSaleEventsForToken(collection.address, tokenID, 'successful')
    
    // If only 1 sale exists, get the token mint sale event
    if (tokenSales.length < 2) {
      const transferEvents = await openSeaAPI.fetchSaleEventsForToken(collection.address, tokenID, 'transfer')

      const mintSale = transferEvents[transferEvents.length-1]
      tokenSales.push(mintSale)
    }

    try {
      const newSalesTweet = await composeTweet({
        collection,
        purchase: tokenSales[1],
        sale: tokenSales[0],
        coinbaseAPI,
        floorPrice: collectionData.floorPrice
      })

      // Post a tweet with sale information
      await twitterAPI.postTweet(newSalesTweet)
    } catch (error) {
      console.log(`Unable to post Tweet for ${collection.symbol} ${tokenID}:`, error.message)
    }
  } catch (error) {
    console.log(`Unable to get Sales Events for ${collection.symbol} #${tokenID}:`, error.message)
  }
};
