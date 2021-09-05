import CoinbaseAPI from "../api/CoinbaseAPI";

import { Collection, Sale } from "../types";

import { 
  addCommas, 
  getYMDaysBetween, 
  getTotalDaysBetween, 
  getShortWalletAddress,
  rounded
} from "../shared/Formatters";

interface NamedParameters {
  collection: Collection
  purchase: Sale
  sale: Sale
  coinbaseAPI: CoinbaseAPI
}

// Composes a tweet using the Sale information
export async function composeTweet({ collection, purchase, sale, coinbaseAPI }: NamedParameters): Promise<string> {
  // Get Token ID & OpenSea Link
  const tokenId = sale.asset.tokenId
  const openSeaLink = sale.asset.link

  // Get rounded Bought & Sold price in ETH
  const boughtPrice = rounded(purchase.salePrice)
  const soldPrice = rounded(sale.salePrice)

  // Missing BoughtPrice or SoldPrice
  if (boughtPrice <= 0 || soldPrice <= 0) {
    console.log("OpenSea Link:", sale.asset.link)
    throw new Error("missing bought or sold price")
  }

  // Get formatted Bought & Sold dates
  const boughtDate = purchase.transaction.timestamp
  const soldDate = sale.transaction.timestamp

  // Get HODL Duration & Days
  const hodlDuration = getYMDaysBetween(soldDate, boughtDate)
  const hodlDays = getTotalDaysBetween(soldDate, boughtDate)

  // Get the bought & sold prices in ETH
  let boughtPriceETH = 0
  let soldPriceETH = 0

  try {
    boughtPriceETH = await coinbaseAPI.getUSDPriceForETH(boughtDate)
    soldPriceETH = await coinbaseAPI.getUSDPriceForETH(soldDate)
  } catch (error) {
    throw new Error(error)
  }

  // Get the bought & sold prices in USD
  const boughtPriceUSD = purchase.salePrice * boughtPriceETH
  const soldPriceUSD = sale.salePrice * soldPriceETH

  // Get formatted ETH price for Bought & Sold dates
  const boughtPriceETHFormatted = addCommas(boughtPriceETH)
  const soldPriceETHFormatted = addCommas(soldPriceETH)
  
  // Get the Profit/Loss value in USD
  const profitLossUSD = Math.round(soldPriceUSD - boughtPriceUSD)
  const profitLossUSDFormatted = addCommas(profitLossUSD)

  // Get the Flip Percentage
  const flipValueRounded = rounded((soldPriceUSD - boughtPriceUSD) / boughtPriceUSD)
  const flipPercentage = flipValueRounded * 100
  const flipPercentageRounded = rounded(flipPercentage)
  const flipPercentageRoundedFormatted = addCommas(Math.abs(flipPercentageRounded))

  // Get the Profit/Loss labels
  const isProfitLoss = flipPercentageRounded > 0 ? 'PROFIT' : 'LOSS'
  const isProfitLossEmoji = flipPercentageRounded > 0 ? '🚀' : '🧐'
  const isProfitLossPercentageEmoji = flipPercentageRounded > 0 ? '📈 +' : '📉 -'

  // Calculate Annualized Returns
  // Formula: return % / no. days held x 365
  // Credit: Anonn.eth
  const annualizedReturns = flipPercentageRounded / hodlDays * 365
  const annualizedReturnsFormatted = addCommas(Math.round(rounded(annualizedReturns)))

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
  const boughtInfo = `🛍 Bought: ${boughtPrice} ${sale.paymentToken.symbol} @ $${boughtPriceETHFormatted}/ETH\n`
  const soldInfo = `💰 Sold: ${soldPrice} ${sale.paymentToken.symbol} @ $${soldPriceETHFormatted}/ETH\n`
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
