import moment from 'moment-timezone';

import CoinbaseAPI from "../api/CoinbaseAPI"

import { Sale, SaleData } from "../types"

import { SUPPORTED_PAYMENT_TOKEN_SYMBOLS } from "../shared/Constants"
import { getTotalDaysBetween, rounded } from "../shared/Formatters"

interface SaleDataParams {
  purchase: Sale
  sale: Sale
  coinbaseAPI: CoinbaseAPI
}

export async function getSaleData({ purchase, sale, coinbaseAPI }: SaleDataParams): Promise<SaleData> {
  // Get Token ID & OpenSea Link
  const tokenId = Number(sale.asset.tokenId)
  const openSeaLink = sale.asset.link

  // Get Seller Username or Wallet address
  const seller = sale.seller
  const sellerAddress = seller.address
  const sellerUsername = seller.username

  const purchaseToken = purchase.paymentToken && purchase.paymentToken.symbol || 'ETH'
  const saleToken = sale.paymentToken && sale.paymentToken.symbol || 'ETH'

  // Currently we only support ETH & WETH
  // For any other paymentToken, throw an error
  if (!SUPPORTED_PAYMENT_TOKEN_SYMBOLS.includes(purchaseToken)) {
    throw new Error(`unsupported purchaseToken ${purchaseToken}`)
  } else if (!SUPPORTED_PAYMENT_TOKEN_SYMBOLS.includes(saleToken)) {
    throw new Error(`unsupported saleToken ${saleToken}`)
  }

  // Get rounded Bought & Sold price in ETH
  const boughtPriceETH = rounded(purchase.salePrice)
  const soldPriceETH = rounded(sale.salePrice)

  // Missing BoughtPrice or SoldPrice
  if (boughtPriceETH <= 0 || soldPriceETH <= 0) {
    throw new Error(`missing bought or sold price | ${sale.asset.link}`)
  }

  // Get the Profit/Loss value in ETH
  const profitLossETH = rounded(soldPriceETH - boughtPriceETH)

  // isProfit is only calcuated in ETH
  const isProfit = profitLossETH > 0 ? true : false

  // Get formatted Bought & Sold dates
  const boughtDate = purchase.timestamp
  const soldDate = sale.timestamp

  // Get HODL Days
  const hodlDays = getTotalDaysBetween(soldDate, boughtDate)

  // Get the ETH prices on bought & sold dates
  try {
    const todayDate = moment(new Date()).format("YYYY-MM-DDT00:00:00")    
    var todayETHPrice = await coinbaseAPI.getUSDPriceForETH(todayDate)

    var boughtDateETHPrice = await coinbaseAPI.getUSDPriceForETH(boughtDate, todayETHPrice)
    var soldDateETHPrice = await coinbaseAPI.getUSDPriceForETH(soldDate, todayETHPrice)
  } catch (error) {
    throw error
  }

  // Get the bought & sold prices in USD
  const boughtPriceUSD = Math.round(boughtPriceETH * boughtDateETHPrice)
  const soldPriceUSD = Math.round(soldPriceETH * soldDateETHPrice)

  // Get the Profit/Loss Flip value in USD
  const flipValueUSD = Math.round(soldPriceUSD - boughtPriceUSD)

  // Get the Flip Percentage
  const flipValueUSDRounded = rounded((soldPriceUSD - boughtPriceUSD) / boughtPriceUSD)
  const flipPercentageUSD = rounded(flipValueUSDRounded * 100)

  // Calculate Annualized Returns
  // Formula: return % / no. days held x 365
  // Credit: Anonn.eth
  const annualizedReturns = rounded(flipPercentageUSD / hodlDays * 365)

  return {
    tokenId,
    sellerAddress,
    sellerUsername,
    openSeaLink,
    boughtPriceETH,
    boughtDate,
    boughtDateETHPrice,
    boughtPriceUSD,
    soldPriceETH,
    soldDate,
    soldDateETHPrice,
    soldPriceUSD,
    isProfit,
    profitLossETH,
    hodlDays,
    flipValueUSD,
    flipPercentageUSD,
    annualizedReturns
  }
}

export function getProfitThresholdETH(floorPrice: number): number {
  // If no floor price available for collection
  // Default to 1 ETH profit threshold
  if (!floorPrice || floorPrice == 0) {
    return 1
  }

  if (floorPrice > 100) {
    return rounded(floorPrice * 0.1)
  }

  if (floorPrice > 75) {
    return rounded(floorPrice * 0.15)
  }

  if (floorPrice > 50) {
    return rounded(floorPrice * 0.2)
  }

  if (floorPrice > 25) {
    return rounded(floorPrice * 0.25)
  }

  if (floorPrice > 10) {
    return rounded(floorPrice * 0.3)
  }

  if (floorPrice > 5) {
    return rounded(floorPrice * 0.4)
  }

  return rounded(floorPrice * 0.5)
}
