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

  // Get Seller Username or Wallet address
  const seller = sale.seller
  const sellerWallet = getShortWalletAddress(seller.address)
  const sellerName = seller.username || sellerWallet

  // Get rounded Bought & Sold price in ETH
  const boughtPriceETH = rounded(purchase.salePrice)
  const soldPriceETH = rounded(sale.salePrice)

  // Missing BoughtPrice or SoldPrice
  if (boughtPriceETH <= 0 || soldPriceETH <= 0) {
    console.log("OpenSea Link:", sale.asset.link)
    throw new Error("missing bought or sold price")
  }

  // Get the Profit/Loss value in ETH
  const profitLossETH = rounded(soldPriceETH - boughtPriceETH)

  // Get formatted Bought & Sold dates
  const boughtDate = purchase.transaction.timestamp
  const soldDate = sale.transaction.timestamp

  // Get HODL Days
  const hodlDays = getTotalDaysBetween(soldDate, boughtDate)

  // Get the ETH prices on bought & sold dates
  try {
    var boughtDateETHPrice = await coinbaseAPI.getUSDPriceForETH(boughtDate)
    var soldDateETHPrice = await coinbaseAPI.getUSDPriceForETH(soldDate)
  } catch (error) {
    throw new Error(error)
  }

  // Get the bought & sold prices in USD
  const boughtPriceUSD = Math.round(purchase.salePrice * boughtDateETHPrice)
  const soldPriceUSD = Math.round(sale.salePrice * soldDateETHPrice)

  // Get the Profit/Loss value in USD
  const profitLossUSD = Math.round(profitLossETH * soldDateETHPrice)

  // Get whether it's a profit or loss
  const isProfit = profitLossETH > 0 ? true : false

  return {
    tokenId,
    sellerName,
    openSeaLink,
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
    isProfit,
  }
}

export function getSaleTypeInfo(isProfit: boolean, boughtPriceUSD: number, soldPriceUSD: number, hodlDays: number, didSellBelowFloor: boolean) {
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
  if (!isProfit) {
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
