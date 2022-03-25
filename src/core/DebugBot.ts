import CoinbaseAPI from '../api/CoinbaseAPI';
import DearEarthAPI from '../api/DearEarthAPI';
import OpenSeaAPI from '../api/OpenSeaAPI';
import TwitterAPI from '../api/TwitterAPI';
import LooksRareAPI from '../api/LooksRareAPI';
import { composeTweet } from './Twitter';
import { getCollectionData } from './SalesBot';
import { composeLooksRareTweet } from './LooksRare';
import { CollectionSlug } from '../shared/Constants';
import { getCollectionFromSlug } from '../utils/OpenSea';
import { getCurrentUnixTimeMinusFifteenMinutes } from '../utils/DateTime';
import { cleanupDownloadedImages, downloadImage } from '../utils/Image';

export async function runDebugBot(
  openSeaAPI: OpenSeaAPI,
  coinbaseAPI: CoinbaseAPI,
  twitterAPI: TwitterAPI,
  dearEarthAPI: DearEarthAPI,
  looksRareAPI: LooksRareAPI
) {
  // Get the Collection Data
  const collection = getCollectionFromSlug(CollectionSlug.boredapeyachtclub)
  const collectionData = await getCollectionData(collection, openSeaAPI, dearEarthAPI)
  const tokenID = 7161

  // Don't debug the OpenSea sale & tweet
  const TWEET_OPENSEA_SALE = true

  // Don't debug the LooksRare sale & tweet
  const TWEET_LOOKSRARE_SALE = false

  // The file path of the downloaded collection image
  let filePath = undefined

  if (TWEET_OPENSEA_SALE) {
    try {
      // Fetch transactions from OpenSeaAPI
      const tokenSales = await openSeaAPI.fetchSaleEventsForToken(collection.address, tokenID, 'successful')
      
      // If only 1 sale exists, get the token mint sale event
      if (tokenSales.length < 2) {
        const transferEvents = await openSeaAPI.fetchSaleEventsForToken(collection.address, tokenID, 'transfer')

        const mintSale = transferEvents[transferEvents.length-1]
        tokenSales.push(mintSale)
      }

      // This is the twitter mediaId that we'll include with the tweet
      let mediaId = undefined
        
      try {
        // Download the collection image to the file path
        filePath = await downloadImage(
          tokenSales[0].asset.image,
          tokenSales[0].asset.collection.slug
        )

        // Upload the collection image to Twitter
        // get a Twitter mediaId to include in the tweet
        mediaId = await twitterAPI.uploadImage(filePath)
      } catch (error) {
        console.log(
          `Oops! Unable to download image from ${tokenSales[0].asset.image}\n`
        )
      }

      const tweetText = await composeTweet({
        collection,
        purchase: tokenSales[1],
        sale: tokenSales[0],
        coinbaseAPI,
        floorPrice: collectionData.floorPrice
      })

      // Post a tweet with sale information
      await twitterAPI.postTweet(tweetText, mediaId)
    } catch (error) {
      console.log(`Unable to post Tweet for ${collection.symbol} ${tokenID}:`, error.message)
    } finally {
      // If file path exists, then go ahead and delete it
      if (filePath) {
        await cleanupDownloadedImages([filePath])
        filePath = undefined
      }
    }
  }

  if (TWEET_LOOKSRARE_SALE) {
    const timeStamp = getCurrentUnixTimeMinusFifteenMinutes()

    try {
      // Fetch transactions from LooksRareAPI
      const transactions = await looksRareAPI.fetchTransactions(timeStamp)

      if (transactions.length > 0) {
        console.log(`\nGot ${transactions.length} LooksRare Transctions in the last 15 mins`)

        // Post a tweet for LooksRare Transction
        const looksRareSaleTweet = await composeLooksRareTweet({ transaction: transactions[0], coinbaseAPI})
        await twitterAPI.postTweet(looksRareSaleTweet)
      } else {
        console.log(`\nNo LooksRare Transactions. Change the dateSince Unix timestamp`)
      }
    } catch (error) {
      console.log(`Unable to get LooksRare Transcations for dateSince ${timeStamp}`, error.message)
    }
  }
}
