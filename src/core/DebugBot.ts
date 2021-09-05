import OpenSeaAPI from '../api/OpenSeaAPI';
import CoinbaseAPI from '../api/CoinbaseAPI';

import { composeTweet } from "./Twitter";

import { CollectionSlug } from '../types';

import { getCollectionFromSlug } from "../shared/Helpers";

export async function runDebugBot(openSeaAPI: OpenSeaAPI, coinbaseAPI: CoinbaseAPI) {
  const collection = getCollectionFromSlug(CollectionSlug.mutantapeyachtclub)
  const tokenID = '8495'

  try {
    const tokenSales = await openSeaAPI.fetchSaleEventsForToken(collection.address, tokenID)
    
    if (tokenSales.length < 2) {
      console.log(`${collection.name} #${tokenID} only has 1 sales event`, "\n")
      return
    }

    // Compose Tweet for NFT Sale
    const newSalesTweet = await composeTweet({
      collection,
      purchase: tokenSales[1],
      sale: tokenSales[0],
      coinbaseAPI
    })

    console.log(newSalesTweet, "\n")
  } catch (error) {
    console.log(`Unable to compose tweet for ${collection.name} #${tokenID}:`, error.message)
  }
};
