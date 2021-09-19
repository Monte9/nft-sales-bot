import CoinbaseAPI from "../api/CoinbaseAPI"
import { Sale, SaleData } from "../types"

import { getShortWalletAddress, getTotalDaysBetween, getYMDaysBetween, rounded } from "../shared/Formatters"

interface SaleDataParams {
  purchase: Sale
  sale: Sale
  coinbaseAPI: CoinbaseAPI
}

export async function getSaleData({ purchase, sale, coinbaseAPI }: SaleDataParams): Promise<SaleData> {
  // Get Token ID & OpenSea Link
  const tokenId = sale.asset.tokenId
  const openSeaLink = sale.asset.link

  // Get rounded Bought & Sold price in ETH
  const boughtPrice = rounded(purchase.salePrice)
  const soldPrice = rounded(sale.salePrice)

  // Get the Profit/Loss value in ETH
  const profitLossETH = rounded(soldPrice - boughtPrice)

  // Missing BoughtPrice or SoldPrice
  if (boughtPrice <= 0 || soldPrice <= 0) {
    console.log("OpenSea Link:", sale.asset.link)
    throw new Error("missing bought or sold price")
  }

  // Get formatted Bought & Sold dates
  const boughtDate = purchase.transaction.timestamp
  const soldDate = sale.transaction.timestamp

  // Get HODL Days
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

  // Get the Profit/Loss value in USD
  const profitLossUSD = Math.round(soldPriceUSD - boughtPriceUSD)

  // Get the Flip Percentage
  const flipValueRounded = rounded((soldPriceUSD - boughtPriceUSD) / boughtPriceUSD)
  const flipPercentage = rounded(flipValueRounded * 100)

  // Get whether it's a profit or loss
  const isProfit = flipPercentage > 0 ? true : false

  // Get Seller Username or Wallet address
  const seller = sale.seller
  const sellerWallet = getShortWalletAddress(seller.address)
  const sellerName = seller.username || sellerWallet

  // Calculate Annualized Returns
  // Formula: return % / no. days held x 365
  // Credit: Anonn.eth
  const annualizedReturns = flipPercentage / hodlDays * 365

  return {
    tokenId,
    sellerName,
    openSeaLink,
    isProfit,
    boughtPrice,
    boughtPriceETH,
    boughtPriceUSD,
    boughtDate,
    soldPrice,
    soldPriceETH,
    soldPriceUSD,
    soldDate,
    hodlDays,
    profitLossETH,
    profitLossUSD,
    flipPercentage,
    annualizedReturns,
  }
}

export function getSaleTypeInfo(flipPercentageRounded: number, boughtPriceUSD: number, soldPriceUSD: number, hodlDays: number, didSellBelowFloor: boolean) {
  // They accepted a bot offer below current floor price
  if (didSellBelowFloor) {
    return 'Below Floor #NGMI'
  }

  // If Sold price < 40% of Bought price
  if (soldPriceUSD <boughtPriceUSD * 0.4) {
    return 'Noodle Hands'
  }

  // If Sold price < 40% of Bought price
  if (soldPriceUSD <boughtPriceUSD * 0.4) {
    return 'Noodle Hands'
  }

  // If it's a loss
  if (flipPercentageRounded < 0) {
    return 'Paper Hands'
  }

  // If HODL duration is more than 90 days (3 months)
  if (hodlDays > 90) {
    return 'Diamond Hands'
  }

  // If sold price is 1.5 times bought price
  if (soldPriceUSD > boughtPriceUSD * 1.5) {
    return 'Good Flip'
  }

  // If sold price is 5 times bought price
  if (soldPriceUSD > boughtPriceUSD * 5) {
    return 'Expert Flipper'
  }

  return 'Noob Flipper'
}
