import OpenSeaAPI from "../../api/OpenSeaAPI"

import { TwitterMention } from "../../types/NFTSalesBot"
import { OpenSeaCollection } from "../../types/OpenSeaCollection"

import { CollectionSlug } from "../../shared/Constants"

// Compose a Reply for a Twitter Mention - Portfolio
export async function composePortfolioReply(mention: TwitterMention, openSeaAPI: OpenSeaAPI): Promise<string> {
  const tweetText = mention.text.toLowerCase()
  const portfolioKeyword = 'portfolio'.toLowerCase()

  if (!tweetText.includes(portfolioKeyword)) {
    throw new Error(`missing ${portfolioKeyword} keyword`)
  }

  // Dear Earth
  const wallet = '0x6e7592ff3C32c93A520A11020379d66Ab844Bf5B'

  console.log(`Getting all collections for ${wallet}`)

  let page = 0
  let allCollections: OpenSeaCollection[] = []

  while(true) {
    let collection: OpenSeaCollection[] = []

    try {
      collection = await openSeaAPI.fetchParsedCollections(wallet, page)
    } catch (error) {
      break
    }

    if (!collection || collection.length < 1) {
      break
    } else {
      allCollections.push(...collection)
      page = page + 1
    }
  }

  console.log('')

  let reply = 'You own the following NFTs\n\n'

  // Sort Collection by most owned to least
  allCollections.sort(function(firstCollection, secondCollection) {
    if (firstCollection.ownedAssetCount == secondCollection.ownedAssetCount) {
      return 0
    } else if (firstCollection.ownedAssetCount < secondCollection.ownedAssetCount) {
      return 1;
    } else {
      return -1;
    }
  });

  const filteredCollections = allCollections.map((collection, index) => {
    if (Object.values(CollectionSlug).includes(collection.slug)) {
      return collection
    }
  })

  const cleanFilteredCollections = filteredCollections.filter(collection => collection !== undefined)

  cleanFilteredCollections.map((collection, index) => {
    reply = reply + `- ${collection.ownedAssetCount}x ${collection.name}\n`
  })
  console.log('')

  reply = reply + 'Your portfolio is worth ~$$$ (Coming soon)'

  return reply
}
