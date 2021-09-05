import OpenSeaAPI from '../../api/OpenSeaAPI';
import CoinbaseAPI from '../../api/CoinbaseAPI';

import { composeTweet } from "../Twitter";

import { CollectionSymbol } from "../../shared/Constants";
import { getCollectionFromSymbol } from "../../shared/Helpers";

export async function runDebugBot(coinbaseAPI: CoinbaseAPI) {
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

    console.log(`Got a new sale`, '\n')

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
