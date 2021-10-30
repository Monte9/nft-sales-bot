import CoinbaseAPI from '../api/CoinbaseAPI';
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
  const tokenID = '695'

  try {
    const tokenSales = await openSeaAPI.fetchSaleEventsForToken(collection.address, tokenID)
    
    // If only 1 sale exists, it's not considered a FLIP - just ignore it
    if (tokenSales.length < 2) {
      console.log(`${collection.symbol} #${tokenID} only has 1 sales event`, '\n')
      return
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
