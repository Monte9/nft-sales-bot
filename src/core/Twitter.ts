import CoinbaseAPI from "../api/CoinbaseAPI";

import { Collection, Sale } from "../types/OpenSeaSale";

import { 
  addCommas, 
  getYMDaysBetween, 
  getTotalDaysBetween, 
  getShortWalletAddress
} from "../shared/Formatters";
import { isError } from "../shared/Helpers";

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
