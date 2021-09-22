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
    boughtPriceETH,
    boughtDate,
    boughtDateETHPrice,
    boughtPriceUSD,
    soldPriceETH,
    soldDate,
    soldDateETHPrice,
    soldPriceUSD,
    hodlDays,
    profitLossETH,
    profitLossUSD,
  } = salesData

  // Get the absolute profit without the minus sign for losses
  const absoluteProfitLossETH = Math.abs(profitLossETH)
  const absoluteProfitLossUSD = Math.abs(profitLossUSD)

  const didSellBelowFloor = sale.salePrice < floorPrice
  console.log(`Floor price for ${collection.name} is ${floorPrice} ETH`)

  // Get HODL Duration
  const hodlDuration = getYMDaysBetween(soldDate, boughtDate)

  // Get formatted ETH price for Bought & Sold dates
  const boughtDateETHPriceFormatted = addCommas(boughtDateETHPrice)
  const soldDateETHPriceFormatted = addCommas(soldDateETHPrice)
  
  // Get formatted Profit/Loss value in USD
  const profitLossUSDFormatted = addCommas(absoluteProfitLossUSD)

  // Get the Profit/Loss label
  const isProfitEmoji = isProfit ? '👍🏼' : '👎🏼'
  const isProfitLoss = isProfit ? 'Profit' : 'Loss'
  const isProfitSign = isProfit ? '+' : '-'

  // Get Sale type
  const saleTypeTitle = isProfit ? 'FLIPPED' : 'FUMBLED'
  const saleTypeInfo = getSaleTypeInfo(isProfit, boughtPriceUSD, soldPriceUSD, hodlDays, didSellBelowFloor)

  // Format the Tweet content
  const intro = `${sellerName} ${saleTypeTitle} ${collection.symbol} #${tokenId}\n`
  const flipInfo = `${isProfitEmoji} ${isProfitLoss}: ${absoluteProfitLossETH} ETH = ${isProfitSign}$${profitLossUSDFormatted}\n`
  const hodlInfo = `🤝 HODL: ${hodlDuration}\n`
  const boughtInfo = `🛍 Bought: ${boughtPriceETH} ${sale.paymentToken.symbol} @ $${boughtDateETHPriceFormatted}/ETH\n`
  const soldInfo = `💰 Sold: ${soldPriceETH} ${sale.paymentToken.symbol} @ $${soldDateETHPriceFormatted}/ETH\n`
  const status = `🏆 Status: ${saleTypeInfo}\n`

  const tweetContent = intro + '\n' + flipInfo + hodlInfo + '\n' + boughtInfo + soldInfo + '\n' + status + openSeaLink

  // Only report losses > 1 ETH OR if profit > profitThreshold for the collection
  if (!isProfit && absoluteProfitLossETH < 1 || isProfit && absoluteProfitLossUSD < collection.profitThreshold) {
    const fomattedProfitThreshold = addCommas(collection.profitThreshold)
    throw new Error(`profit/loss for ${collection.symbol} #${tokenId} under $${fomattedProfitThreshold}\n${openSeaLink}\n`)
  }

  return tweetContent
}
