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
  const boughtPriceUSD = Math.round(purchase.salePrice * boughtPriceETH)
  const soldPriceUSD = Math.round(sale.salePrice * soldPriceETH)

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
  const annualizedReturnsInfo = `💸 Annualized Returns: ${annualizedReturnsFormatted}%\n`
  // TODO: not using annualizedReturnsInfo

  // Get Seller Username or Wallet address
  const seller = sale.seller
  const sellerWallet = getShortWalletAddress(seller.address)
  const sellerName = seller.username || sellerWallet

  // Get Sale type
  const saleTypeEmoji = flipPercentageRounded > 0 ? '🏆' : '🥲'
  const saleTypeTitle = flipPercentageRounded > 0 ? 'FLIPPED' : 'FUMBLED'
  const saleTypeInfo = getSaleTypeInfo(flipPercentageRounded, boughtPriceUSD, soldPriceUSD, hodlDays)

  // Format the Tweet content
  const intro = `${sellerName} ${saleTypeTitle} ${collection.symbol} #${tokenId}\n`
  const boughtInfo = `🛍 Bought: ${boughtPrice} ${sale.paymentToken.symbol} @ $${boughtPriceETHFormatted}/ETH\n`
  const soldInfo = `💰 Sold: ${soldPrice} ${sale.paymentToken.symbol} @ $${soldPriceETHFormatted}/ETH\n`
  const hodlInfo = `🤝 HODL Duration: ${hodlDuration}\n`
  const flipInfo = `${isProfitLossEmoji} ${isProfitLoss}: $${profitLossUSDFormatted} (${isProfitLossPercentageEmoji}${flipPercentageRoundedFormatted}%)\n`
  
  const status = `${saleTypeEmoji} Status: ${saleTypeInfo}\n`
  const tweetContent = intro + '\n' + status + '\n' + boughtInfo + soldInfo + '\n' + hodlInfo + flipInfo + openSeaLink

  // Report all losses OR only if profit is > profitThreshold for the collection
  if (flipPercentageRounded > 0 && profitLossUSD < collection.profitThreshold) {
    const fomattedProfitThreshold = addCommas(collection.profitThreshold)
    throw new Error(`profit for ${collection.symbol} #${tokenId} under $${fomattedProfitThreshold}\n${openSeaLink}\n`)
  }

  return tweetContent
}

function getSaleTypeInfo(flipPercentageRounded: number, boughtPriceUSD: number, soldPriceUSD: number, hodlDays: number) {
  // If Sold price < 40% of Bought price
  if (soldPriceUSD <boughtPriceUSD * 0.4) {
    return 'Noodle Hands'
  }

  // If it's a loss
  if (flipPercentageRounded < 0) {
    return 'Paper Hands'
  }

  // If sold price is 1.5 times bought price
  if (soldPriceUSD > boughtPriceUSD * 1.5) {
    return 'Expert Flipper'
  }

  // If HODL duration is more than 90 days (3 months)
  if (hodlDays > 90) {
    return 'Diamond Hands'
  }

  return 'Noob Flipper'
}
