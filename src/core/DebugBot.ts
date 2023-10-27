import CoinbaseAPI from '../api/CoinbaseAPI'
import OpenSeaAPI from '../api/OpenSeaAPI'
import TwitterAPI from '../api/TwitterAPI'
import { composeTweet } from './Twitter'
import { getCollectionFromSlug } from '../utils/OpenSea'
import { cleanupDownloadedImages, downloadImage } from '../utils/Image'

export async function runDebugBot(
  openSeaAPI: OpenSeaAPI,
  coinbaseAPI: CoinbaseAPI,
  twitterAPI: TwitterAPI
) {
  // Get the Collection Data
  const collection = getCollectionFromSlug('mutant-ape-yacht-club')
  const tokenId = 18012

  // The file path of the downloaded collection image
  let filePath = undefined

  try {
    // Fetch transactions from OpenSeaAPI
    const tokenSales = await openSeaAPI.fetchSaleEventsForToken(
      collection.address,
      tokenId,
      'successful'
    )

    // If only 1 sale exists, get the token mint sale event
    if (tokenSales.length < 2) {
      const transferEvents = await openSeaAPI.fetchSaleEventsForToken(
        collection.address,
        tokenId,
        'transfer'
      )

      const mintSale = transferEvents[transferEvents.length - 1]
      tokenSales.push(mintSale)
    }

    const tweetText = await composeTweet({
      collection,
      purchase: tokenSales[1],
      sale: tokenSales[0],
      coinbaseAPI
    })

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
      console.error(
        `Oops! Unable to download image from ${tokenSales[0].asset.image}\n`
      )
    }

    // Post a tweet with sale information
    await twitterAPI.postTweet(tweetText, mediaId, collection.symbol, tokenId)
  } catch (error) {
    console.error(
      `Unable to post Tweet for ${collection.symbol} ${tokenId}:`,
      error.message
    )
  } finally {
    // If file path exists, then go ahead and delete it
    if (filePath) {
      await cleanupDownloadedImages([filePath])
      filePath = undefined
    }
  }
}
