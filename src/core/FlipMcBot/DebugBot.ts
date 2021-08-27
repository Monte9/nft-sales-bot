import OpenSeaAPI from '../../api/OpenSeaAPI';
import CoinbaseAPI from '../../api/CoinbaseAPI';
import TwitterAPI from '../../api/TwitterAPI';

import { composeReply, composeTweet } from "../Twitter";

import { CollectionSymbol } from "../../shared/Constants";
import { getCollectionFromSymbol, isError } from "../../shared/Helpers";

export async function runDebugBot(coinbaseAPI: CoinbaseAPI, twitterAPI: TwitterAPI) {
  // Get an OpenSea Collection
  const collection = getCollectionFromSymbol(CollectionSymbol.BAYC);

  // Create an OpenSea API instance using the Collection smart contract address
  const openSeaAPI = new OpenSeaAPI(collection.address)

  // ------
  // Floor Mentions Bot
  // ------

  try {
    const mentions = await twitterAPI.fetchParsedMentions();
    // Floor prices = mentions[9]
    const mention = mentions[0]

    console.log(`Got a mention from ${mention.author.username}: ${mention.text}`)
    console.log(`https://twitter.com/${mention.author.username}/status/${mention.tweetId}`, '\n')

    const tweetText = await composeReply(mention, openSeaAPI)
    console.log(tweetText)
  } catch (error) {
    console.log('Unable to compose reply:', error.message)
  }

  console.log(`-------------`)

  // ------
  // NFT Sales Bot
  // ------

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
