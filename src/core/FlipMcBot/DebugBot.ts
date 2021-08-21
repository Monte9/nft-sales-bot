import OpenSeaAPI from '../../api/OpenSeaAPI';
import CoinbaseAPI from '../../api/CoinbaseAPI';
import TwitterAPI from '../../api/TwitterAPI';

import { composeReply, composeTweet } from "../Twitter";

import { CollectionSymbol } from "../../shared/Constants";
import { getCollectionFromSymbol } from "../../shared/Helpers";

export async function runDebugBot(coinbaseAPI: CoinbaseAPI, twitterAPI: TwitterAPI) {
  // Get an OpenSea Collection
  const collection = getCollectionFromSymbol(CollectionSymbol.BAYC);

  // Create an OpenSea API instance using the Collection smart contract address
  const openSeaAPI = new OpenSeaAPI(collection.address)

  // Bored Ape BUG: USDC sale - Token 822
  // Cool Cat - Token 5943
  const tokenID = '822'

  try {
    const tokenSales = await openSeaAPI.fetchParsedSaleEvents(tokenID)

    if (tokenSales.length < 2) {
      console.log(`${collection.symbol} #${tokenID} only has 1 sales event`, "\n")
      return
    }

    const mentions = await twitterAPI.fetchParsedMentions();
    console.log('Got', mentions.length, 'mentions')

    const tweetText = await composeReply(mentions[0], openSeaAPI)
    console.log(tweetText)


    try {
      const tweetText = await composeTweet({
        collection,
        purchase: tokenSales[1],
        sale: tokenSales[0],
        coinbaseAPI
      })

      // console.log(tweetText, "\n")
    } catch (error) {
      console.log("Unable to post Tweet:", error.message)
    }
  } catch (error) {
    console.log(`Unable to get sales events for ${collection.name} #${tokenID}:`, error.message)
  }
};
