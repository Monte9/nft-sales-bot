import OpenSeaAPI from '../../api/OpenSeaAPI';
import CoinbaseAPI from '../../api/CoinbaseAPI';
import TwitterAPI from '../../api/TwitterAPI';

import { composeTweet } from "../Twitter";

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

    // await twitterAPI.postTweet('Hello NFT World!')

    const collections = await openSeaAPI.fetchParsedCollections()
    console.log('You own:')

    collections.sort(function(firstCollection, secondCollection) {
      if (firstCollection.ownedAssetCount == secondCollection.ownedAssetCount) {
        return 0
      } else if (firstCollection.ownedAssetCount < secondCollection.ownedAssetCount) {
        return 1;
      } else {
        return -1;
      }
    });

    collections.map((collection, index) => {
      console.log(`- ${collection.ownedAssetCount}x ${collection.name}`)
    })
    console.log('')

    try {
      const tweetText = await composeTweet({
        collection,
        purchase: tokenSales[1],
        sale: tokenSales[0],
        coinbaseAPI
      })

      console.log(tweetText, "\n")
    } catch (error) {
      console.log("Unable to post Tweet:", error.message)
    }
  } catch (error) {
    console.log(`Unable to get sales events for ${collection.name} #${tokenID}:`, error.message)
  }
};
