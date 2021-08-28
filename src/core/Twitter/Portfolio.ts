import moment from 'moment-timezone';

import OpenSeaAPI from "../../api/OpenSeaAPI"
import CoinbaseAPI from "../../api/CoinbaseAPI"

import { getWalletAddress } from '../ENS';

import { TwitterMention } from "../../types/NFTSalesBot"
import { OpenSeaCollection } from "../../types/OpenSeaCollection"

import { CollectionSlug } from "../../shared/Constants"
import { isError } from '../../shared/Helpers';
import { addCommas } from '../../shared/Formatters';

// Compose a Reply for a Twitter Mention - Portfolio
export async function composePortfolioReply(mention: TwitterMention, openSeaAPI: OpenSeaAPI, coinbaseAPI: CoinbaseAPI): Promise<string> {
  const tweetText = mention.text.toLowerCase()
  const portfolioKeyword = 'portfolio'.toLowerCase()

  if (!tweetText.includes(portfolioKeyword)) {
    throw new Error(`missing ${portfolioKeyword} keyword`)
  }

  let address = null
  let reply = null

  try {
    address = await getWalletAddress(mention);
  } catch (error) {
    reply = `Unable to get NFT portfolio data. Make sure to include a ENS or wallet address.`
    return reply
  }

  console.log(`Getting all collections for ${address}`)

  let page = 0
  let allCollections: OpenSeaCollection[] = []

  while(true) {
    let collection: OpenSeaCollection[] = []

    try {
      collection = await openSeaAPI.fetchParsedCollections(address, page)
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

  reply = 'You own the following NFTs\n'

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
  let portfolioValueETH = 0
  let portfolioValueUSD = 0

  const todayDate = new Date()
  const dateFormat = moment().format('YYYY-MM-DD');

  const ethUSDPrice = await coinbaseAPI.getUSDPriceForETH(dateFormat)

  if (isError(ethUSDPrice)) {
    console.log(`Today date: ${todayDate}`)
    throw new Error("Unable to get ETH/USD value from Coinbase API\n")
  }
  
  // Type cast the price to number
  const ethUSDPriceNumber = Number(ethUSDPrice)
  const roundedETHUSDPriceNumber = Math.round(ethUSDPriceNumber * 100) / 100

  for (let index=0; index<cleanFilteredCollections.length; index++) {
    if (index > 3) {
      break
    }

    const collection = cleanFilteredCollections[index]

    let floorPrice = collection.stats.floorPrice
    if (collection.slug === CollectionSlug.cryptopunks) {
      floorPrice = 120
    } else if (collection.slug === CollectionSlug.boredapeyachtclub) {
      floorPrice = 50
    }

    const ethValue = Math.round(collection.ownedAssetCount * floorPrice * 100) / 100

    portfolioValueETH = portfolioValueETH + ethValue
    portfolioValueUSD = portfolioValueUSD + (portfolioValueETH * roundedETHUSDPriceNumber)

    console.log(collection.name)

    if (index < 4) {
      reply = reply + `- ${collection.ownedAssetCount}x ${collection.name} ~ ${ethValue} ETH\n`
    }
  }

  console.log('')

  const roundedPortfolioValueETH = Math.round(portfolioValueETH)
  const roundedPortfolioValueUSD = Math.round(portfolioValueUSD)

  reply = reply + `\nYour portfolio floor is worth ${addCommas(roundedPortfolioValueETH)} ETH ($${addCommas(roundedPortfolioValueUSD)}) `
  return reply
}
