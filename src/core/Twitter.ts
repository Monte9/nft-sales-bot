import CoinbaseAPI from "../api/CoinbaseAPI";
import { getSaleData, getSaleTypeInfo } from "./SaleData";

import { Collection, Sale, SaleData } from "../types";

import {
  addCommas,
  getYMDaysBetween,
} from "../shared/Formatters";

interface ComposeTweetParams {
  collection: Collection
  purchase: Sale
  sale: Sale
  floorPrice: number
  coinbaseAPI: CoinbaseAPI
}

// Composes a tweet using the Sale information
export async function composeTweet({ collection, purchase, sale, coinbaseAPI, floorPrice }: ComposeTweetParams): Promise<string> {
  let salesData: SaleData = null

  try {
    salesData = await getSaleData({ purchase, sale, coinbaseAPI })
  } catch(error) {
    throw error
  }

  if (salesData === null || !salesData.tokenId) {
    throw new Error(`unable to get sale data for ${collection.symbol} #${sale.asset.tokenId}\n`)
  }

  const {
    tokenId,
    openSeaLink,
    sellerName,
    isProfit,
    boughtPrice,
    boughtDate,
    boughtPriceETH,
    boughtPriceUSD,
    soldPrice,
    soldDate,
    soldPriceETH,
    soldPriceUSD,
    profitLossUSD,
    flipPercentage,
    hodlDays
  } = salesData
  
  const didSellBelowFloor = sale.salePrice < floorPrice
  console.log(`Floor price for ${collection.name} is ${floorPrice} ETH`)

  // Get HODL Duration
  const hodlDuration = getYMDaysBetween(soldDate, boughtDate)

  // Get formatted ETH price for Bought & Sold dates
  const boughtPriceETHFormatted = addCommas(boughtPriceETH)
  const soldPriceETHFormatted = addCommas(soldPriceETH)
  
  // Get formatted Profit/Loss value in USD
  const profitLossUSDFormatted = addCommas(profitLossUSD)

  // Get the formatted Flip Percentage
  const flipPercentageFormatted = addCommas(Math.abs(flipPercentage))

  // Get the Profit/Loss labels
  const isProfitLoss = isProfit ? 'PROFIT' : 'LOSS'
  const isProfitLossEmoji = isProfit ? '🚀' : '🧐'
  const isProfitLossPercentageEmoji = isProfit ? '📈 +' : '📉 -'

  // Get Sale type
  const saleTypeEmoji = isProfit ? '🏆' : '🥲'
  const saleTypeTitle = isProfit ? 'FLIPPED' : 'FUMBLED'
  const saleTypeInfo = getSaleTypeInfo(flipPercentage, boughtPriceUSD, soldPriceUSD, hodlDays, didSellBelowFloor)

  // Format the Tweet content
  const intro = `${sellerName} ${saleTypeTitle} ${collection.symbol} #${tokenId}\n`
  const boughtInfo = `🛍 Bought: ${boughtPrice} ${sale.paymentToken.symbol} @ $${boughtPriceETHFormatted}/ETH\n`
  const soldInfo = `💰 Sold: ${soldPrice} ${sale.paymentToken.symbol} @ $${soldPriceETHFormatted}/ETH\n`
  const hodlInfo = `🤝 HODL Duration: ${hodlDuration}\n`
  const flipInfo = `${isProfitLossEmoji} ${isProfitLoss}: $${profitLossUSDFormatted} (${isProfitLossPercentageEmoji}${flipPercentageFormatted}%)\n`
  
  const status = `${saleTypeEmoji} Status: ${saleTypeInfo}\n`
  const tweetContent = intro + '\n' + status + '\n' + boughtInfo + soldInfo + '\n' + hodlInfo + flipInfo + openSeaLink

  // Report all losses OR only if profit is > profitThreshold for the collection
  if (isProfit && profitLossUSD < collection.profitThreshold) {
    const fomattedProfitThreshold = addCommas(collection.profitThreshold)
    throw new Error(`profit for ${collection.symbol} #${tokenId} under $${fomattedProfitThreshold}\n${openSeaLink}\n`)
  }

  return tweetContent
}
