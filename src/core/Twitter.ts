import CoinbaseAPI from "../api/CoinbaseAPI";

import { getProfitThresholdETH, getSaleData, getSaleTypeInfo } from "./SaleData";

import { Collection, Sale, SaleData } from "../types";

import { addCommas, getYMDaysBetween } from "../shared/Formatters";

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
    flipValueUSD,
    flipPercentageUSD
  } = salesData

  // Get the absolute profit/loss without the minus sign for losses
  const absoluteProfitLossETH = Math.abs(profitLossETH)

  // Check whether they sold below floor - it was a bot offer
  const didSellBelowFloor = sale.salePrice < floorPrice

  // Get HODL Duration
  const hodlDuration = getYMDaysBetween(soldDate, boughtDate)

  // Get formatted ETH price for Bought & Sold dates
  const boughtDateETHPriceFormatted = addCommas(boughtDateETHPrice)
  const soldDateETHPriceFormatted = addCommas(soldDateETHPrice)
  
  // Get formatted Profit/Loss value in USD
  const flipValueUSDFormatted = addCommas(Math.abs(flipValueUSD))
  const flipPercentageUSDFormatted = addCommas(Math.abs(flipPercentageUSD))

  // Get the Profit/Loss labels
  const isETHProfitLoss = isProfit ? '  Ξ  PROFIT' : '  Ξ  LOSS'
  const isUSDProfitLoss = flipPercentageUSD > 0 ? '💲 PROFIT' : '💲 LOSS'
  const isProfitLossPercentageEmoji = flipPercentageUSD > 0 ? '📈 +' : '📉 -'
  const isUSDProfitLossSymbol = flipPercentageUSD > 0 ? '' : '-'

  // Get Sale type
  const saleTypeTitle = isProfit ? 'FLIPPED' : 'FUMBLED'
  const saleTypeInfo = getSaleTypeInfo(isProfit, boughtPriceUSD, soldPriceUSD, hodlDays, didSellBelowFloor)

  // Format the Tweet content
  const intro = `${sellerName} ${saleTypeTitle} ${collection.symbol} #${tokenId}\n`
  const flipInfoETH = `${isETHProfitLoss}: ${absoluteProfitLossETH} ETH\n`
  const flipInfoUSD = `${isUSDProfitLoss}: ${isUSDProfitLossSymbol}$${flipValueUSDFormatted} (${isProfitLossPercentageEmoji}${flipPercentageUSDFormatted}%)\n`
  const hodlInfo = `🤝 HODL: ${hodlDuration}\n`
  const boughtInfo = `🛍 Bought: ${boughtPriceETH} ${sale.paymentToken.symbol} @ $${boughtDateETHPriceFormatted}\n`
  const soldInfo = `💰 Sold: ${soldPriceETH} ${sale.paymentToken.symbol} @ $${soldDateETHPriceFormatted}\n`
  const status = `🏆 Status: ${saleTypeInfo}\n`

  const tweetContent = intro + '\n' + status + '\n' + boughtInfo + soldInfo + hodlInfo + '\n' + flipInfoETH + flipInfoUSD + '\n' + openSeaLink

  // Dynamically get the Profit Threshold for the collection based on floor prices
  const profitThresholdETH = getProfitThresholdETH(floorPrice)

  // Only report losses > 1 ETH
  // OR if profit > profitThreshold for the collection
  if (!isProfit && absoluteProfitLossETH < 1) {
    throw new Error(`${collection.symbol} #${tokenId} FUMBLED for ${profitLossETH} ETH (threshold -1 ETH)\n${openSeaLink}\n`)
  } else if (isProfit && profitLossETH < profitThresholdETH) {
    throw new Error(`${collection.symbol} #${tokenId} FLIPPED for ${profitLossETH} ETH (threshold ${profitThresholdETH} ETH)\n${openSeaLink}\n`)
  }

  return tweetContent
}
