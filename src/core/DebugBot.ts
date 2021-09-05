import OpenSeaAPI from '../api/OpenSeaAPI';
import CoinbaseAPI from '../api/CoinbaseAPI';
import TwitterAPI from '../api/TwitterAPI';

import { composeTweet } from './Twitter';

import { CollectionSlug } from '../types';

import { getCollectionFromSlug } from '../shared/Helpers';

export async function runDebugBot(openSeaAPI: OpenSeaAPI, coinbaseAPI: CoinbaseAPI, twitterAPI: TwitterAPI) {
  const collection = getCollectionFromSlug(CollectionSlug.cryptopunks)
  const tokenID = '6110'

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
        coinbaseAPI
      })  

      // Post a tweet with sale information
      await twitterAPI.postTweet(newSalesTweet)
    } catch (error) {
      console.log("Unable to post tweet:", error.message)
    }
  } catch (error) {
    console.log(`Unable to get Sales Events for ${collection.symbol} #${tokenID}:`, error.message)
  }
};
