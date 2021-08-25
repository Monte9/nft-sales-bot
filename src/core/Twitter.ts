import { ApiV2Includes, TweetV2, Tweetv2TimelineResult } from "twitter-api-v2";

import CoinbaseAPI from "../api/CoinbaseAPI";
import OpenSeaAPI from "../api/OpenSeaAPI";

import { Collection, Sale } from "../types/OpenSeaSale";
import { OpenSeaCollection } from "../types/OpenSeaCollection";
import { TweetAuthor, TwitterMention } from "../types/NFTSalesBot";

import { 
  addCommas, 
  getYMDaysBetween, 
  getTotalDaysBetween, 
  getShortWalletAddress
} from "../shared/Formatters";
import { getCollectionFromSlug, isError } from "../shared/Helpers";
import { CollectionSlug } from "../shared/Constants";

interface NamedParameters {
  collection: Collection
  purchase: Sale
  sale: Sale
  coinbaseAPI: CoinbaseAPI
}

// Composes a tweet using the Sale information
export async function composeTweet({ collection, purchase, sale, coinbaseAPI }: NamedParameters): Promise<string | Error> {
  // Get Token ID & OpenSea Link
  const tokenId = sale.asset.tokenId
  const openSeaLink = sale.asset.link

  // Get rounded Bought & Sold price in ETH
  const boughtPrice = Math.round(purchase.salePrice * 100) / 100
  const soldPrice = Math.round(sale.salePrice * 100) / 100

  // Get formatted Bought & Sold dates
  const boughtDate = purchase.transaction.timestamp
  const soldDate = sale.transaction.timestamp

  // Get HODL Duration & Days
  const hodlDuration = getYMDaysBetween(soldDate, boughtDate)
  const hodlDays = getTotalDaysBetween(soldDate, boughtDate)

  // Get the ETH price for Bought & Sold dates
  const boughtETHPrice = await coinbaseAPI.getUSDPriceForETH(boughtDate)
  const soldETHPrice = await coinbaseAPI.getUSDPriceForETH(soldDate)

  if (isError(boughtETHPrice) || isError(soldETHPrice)) {
    console.log(`Bought date ${boughtDate}`)
    console.log(`Sold date ${soldDate}`)
    throw new Error("Unable to get ETH/USD value from Coinbase API\n")
  }
  
  // Type cast the price to number
  const boughtETHPriceNumber = Number(boughtETHPrice)
  const soldETHPriceNumber = Number(soldETHPrice)

  if (boughtETHPriceNumber <= 0 || soldETHPriceNumber <= 0) {
    console.log(`Got $${boughtETHPriceNumber}/ETH for ${boughtDate}`)
    console.log(`Got $${soldETHPriceNumber}/ETH for ${soldDate}`)
    throw new Error("Got invalid ETH price from Coinbase API\n")
  }

  // Get formatted ETH price for Bought & Sold dates
  const boughtETHPriceFormatted = addCommas(boughtETHPriceNumber)
  const soldETHPriceFormatted = addCommas(soldETHPriceNumber)

  // Get absolute Bought & Sold price in USD
  const boughtPriceUSD = purchase.salePrice * boughtETHPriceNumber
  const soldPriceUSD = sale.salePrice * soldETHPriceNumber

  // Missing BoughtPrice or SoldPrice
  if (boughtPrice <= 0 || soldPrice <= 0) {
    console.log(`Bought Price ${boughtPrice} ETH / $${boughtETHPriceFormatted} USD`)
    console.log(`Sold Price ${soldPrice} ETH / $${soldETHPriceFormatted} USD`)
    console.log("OpenSea Link:", sale.asset.link)
    throw new Error("Bought or Sold Price missing\n")
  }
  
  // Get the Profit/Loss value in USD
  const profitLossUSD = Math.round(soldPriceUSD - boughtPriceUSD)
  const profitLossUSDFormatted = addCommas(profitLossUSD)

  // Get the Flip Percentage
  const flipValueRounded = Math.round((soldPriceUSD - boughtPriceUSD) / boughtPriceUSD * 100) / 100
  const flipPercentage = flipValueRounded * 100
  const flipPercentageRounded = Math.round(flipPercentage * 100) / 100
  const flipPercentageRoundedFormatted = addCommas(Math.abs(flipPercentageRounded))

  // Get the Profit/Loss labels
  const isProfitLoss = flipPercentageRounded > 0 ? 'PROFIT' : 'LOSS'
  const isProfitLossEmoji = flipPercentageRounded > 0 ? '🚀' : '🧐'
  const isProfitLossPercentageEmoji = flipPercentageRounded > 0 ? '📈 +' : '📉 -'

  // Calculate Annualized Returns
  // Formula: return % / no. days held x 365
  // Credit: Anonn.eth
  const annualizedReturns = flipPercentageRounded / hodlDays * 365
  const annualizedReturnsFormatted = addCommas(Math.round(Math.round(annualizedReturns * 100) / 100))

  // Get Twitter Username of the NFT Collection
  let twitterUsername = sale.asset.collection.twitterUsername
  if (!twitterUsername) {
    twitterUsername = sale.asset.collection.name
  }

  // Get Seller Username or Wallet address
  const seller = sale.seller
  const sellerWallet = getShortWalletAddress(seller.address)
  const sellerName = seller.username || sellerWallet

  // Format the Tweet content
  const intro = `${sellerName} FLIPPED ${twitterUsername} #${tokenId}\n`
  const boughtInfo = `🛍 Bought: ${boughtPrice} ${sale.paymentToken.symbol} @ $${boughtETHPriceFormatted}/ETH\n`
  const soldInfo = `💰 Sold: ${soldPrice} ${sale.paymentToken.symbol} @ $${soldETHPriceFormatted}/ETH\n`
  const hodlInfo = `🤝 HODL Duration: ${hodlDuration}\n`
  const flipInfo = `${isProfitLossEmoji} ${isProfitLoss}: $${profitLossUSDFormatted} (${isProfitLossPercentageEmoji}${flipPercentageRoundedFormatted}%)\n`
  const annualizedReturnsInfo = `💸 Annualized Returns: ${annualizedReturnsFormatted}%\n`
  const tweetContent = intro + '\n' + boughtInfo + soldInfo + hodlInfo + flipInfo + '\n' + annualizedReturnsInfo + openSeaLink

  // Report all losses OR only if profit is > profitThreshold for the collection
  if (flipPercentageRounded > 0 && profitLossUSD < collection.profitThreshold) {
    const fomattedProfitThreshold = addCommas(collection.profitThreshold)
    throw new Error(`Profit/Loss USD value for ${collection.name} ${tokenId} under $${fomattedProfitThreshold}\n${openSeaLink}\n`)
  }

  return tweetContent
}

export function parseMentions(mentions: Tweetv2TimelineResult): TwitterMention[] {
  const tweets: TweetV2[] = mentions.data
  const includes: ApiV2Includes = mentions.includes

  return tweets.reduce((acc, tweet) => {
    // Ensure Tweet has ID and the includes array is not empty
    if (tweet.id && includes) {
      // Find the Author of the tweet
      const authorUser = includes.users.find(user => {
        if (user.id == tweet.author_id) {
          return true
        } else {
          return false
        }
      })

      let author: TweetAuthor = {
        id: authorUser.id,
        username: authorUser.username,
        description: authorUser.description,
        name: authorUser.name
      }

      const twitterMention: TwitterMention = {
        authorId: tweet.author_id,
        tweetId: tweet.id,
        text: tweet.text,
        author
      }
      acc.push(twitterMention)
    }

    return acc;
  }, [])
}

// Compose a Reply for a Twitter Mention
export async function composeReply(mention: TwitterMention, openSeaAPI: OpenSeaAPI): Promise<string | Error> {
  let reply = ''

  const wallets: string[] = [
    // Dear Earth
    // Animetas, Cool Cats
    '0x6e7592ff3C32c93A520A11020379d66Ab844Bf5B',
    // JeremiahAllenWelch
    // Meebits, 0n1 Force
    '0x58f7cdf32be333e5a5c7ff8097742ac5535b7a65',
    // Bogeli
    // Bored Apes & BAKC
    '0x36991b237b1a2c2eafd94274f11e589d3c041c95',
    // narendra
    // Guttr Cats & Gutter Rats
    '0x02c349ace1412e3ee40cc72f13ead686a7f08ae4'
  ]

  const allCollections = await Promise.all(
    wallets.map(async (address): Promise<OpenSeaCollection[] | null> => {
      let page = 0
      let pagedCollections: OpenSeaCollection[] = []

      while(true) {
        let collec: OpenSeaCollection[] = []

        try {
          collec = await openSeaAPI.fetchParsedCollections(address, page)
        } catch (error) {
          break
        }

        if (!collec || collec.length < 1) {
          break
        } else {
          pagedCollections.push(...collec)
          page = page + 1
        }
      }

      return pagedCollections
    })
  )

  console.log('')

  const collections = Array.prototype.concat.apply([], allCollections)

  let animetasCollection = getCollectionFromSlug(collections, CollectionSlug.animetas)
  let boredApesKCCollection = getCollectionFromSlug(collections, CollectionSlug.boredapekennelclub)
  let boredApesYCCollection = getCollectionFromSlug(collections, CollectionSlug.boredapeyachtclub)
  let coolCatsCollection = getCollectionFromSlug(collections, CollectionSlug.coolcatsnft)
  let gutterCatsCollection = getCollectionFromSlug(collections, CollectionSlug.guttercatgang)
  let gutterRatsCollection = getCollectionFromSlug(collections, CollectionSlug.gutterrats)
  let meebitsCollection = getCollectionFromSlug(collections, CollectionSlug.meebits)
  let on1ForceCollection = getCollectionFromSlug(collections, CollectionSlug.on1force)

  if (mention.text.includes("floor")) {
    reply = 'These are the current floor prices 🧹\n\n'

    if (animetasCollection) {
      reply = reply + `🦹🏼 Animetas: ${animetasCollection.stats.floorPrice} ETH\n`
    }

    if (boredApesKCCollection) {
      reply = reply + `🐕 Bored Apes KC: ${boredApesKCCollection.stats.floorPrice} ETH\n`
    }
    
    if (boredApesYCCollection) {
      reply = reply + `🦍 Bored Apes YC: ${boredApesYCCollection.stats.floorPrice} ETH\n`
    }
    
    if (coolCatsCollection) {
      reply = reply + `🐱 CoolCats NFT: ${coolCatsCollection.stats.floorPrice} ETH\n`
    }

    if (gutterCatsCollection) {
      reply = reply + `🐈 Gutter Cat Gang: ${gutterCatsCollection.stats.floorPrice} ETH\n`
    }

    if (gutterRatsCollection) {
      reply = reply + `🐀 Gutter Rats: ${gutterRatsCollection.stats.floorPrice} ETH\n`
    }
    
    if (meebitsCollection) {
      reply = reply + `🤖 Meebits: ${meebitsCollection.stats.floorPrice} ETH\n`
    }

    if (on1ForceCollection) {
      reply = reply + `🦹🏼‍♂️ 0N1 Force: ${on1ForceCollection.stats.floorPrice} ETH\n`
    }
  } else {
    console.log("Mentioned tweet doesn't not include keywords: floor", '\n')
  }
  
  // console.log('You own:')
  // Sort Collection by most owned to least
  // collections.sort(function(firstCollection, secondCollection) {
  //   if (firstCollection.ownedAssetCount == secondCollection.ownedAssetCount) {
  //     return 0
  //   } else if (firstCollection.ownedAssetCount < secondCollection.ownedAssetCount) {
  //     return 1;
  //   } else {
  //     return -1;
  //   }
  // });

  // collections.map((collection, index) => {
  //   console.log(`- ${collection.ownedAssetCount}x ${collection.slug}`)
  // })
  // console.log('')

  return reply
}
