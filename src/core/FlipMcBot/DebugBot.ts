import OpenSeaAPI from '../../api/OpenSeaAPI';
import CoinbaseAPI from '../../api/CoinbaseAPI';

import { composeTweet } from "../Twitter";

import { CollectionSymbol } from "../../shared/Constants";
import { getCollectionFromSymbol } from "../../shared/Helpers";

export async function runDebugBot(coinbaseAPI: CoinbaseAPI) {
  // Get an OpenSea Collection
  const collection = getCollectionFromSymbol(CollectionSymbol.COOL);

  // Create an OpenSea API instance using the Collection smart contract address
  const openSeaAPI = new OpenSeaAPI(collection.address)

  // Bored Ape BUG: USDC sale - Token 822
  // Cool Cat - Token 5943
  const tokenID = '5943'

  try {
    const tokenSales = await openSeaAPI.fetchParsedSaleEvents(tokenID)

    if (tokenSales.length <= 1) {
      console.log(`${collection.symbol} #${tokenID} only has 1 Sales Event`, "\n")
      return
    }

    try {
      const tweetText = await composeTweet({
        collection,
        purchase: tokenSales[1],
        sale: tokenSales[0],
        coinbaseAPI
      })

      console.log(tweetText, "\n")
      // this.twitterAPI.postTweet(tweetText)
    } catch (error) {
      console.log("Unable to post Tweet:", error.message)
    }
  } catch (error) {
    console.log(`Unable to get Sales Events for ${collection.symbol} #${tokenID}:`, error.message)
  }
};
