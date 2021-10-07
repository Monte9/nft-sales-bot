import CoinbaseAPI from "../api/CoinbaseAPI"
import { Sale, SaleData } from "../types"
import { getShortWalletAddress, getTotalDaysBetween, rounded } from "../shared/Formatters"

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

  // Get whether it's a profit or loss
  const isProfit = profitLossETH > 0 ? true : false

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
    isProfit,
    flipValueUSD,
    flipPercentageUSD,
  }
}

export function getSaleTypeInfo(isProfit: boolean, boughtPriceUSD: number, soldPriceUSD: number, hodlDays: number, didSellBelowFloor: boolean) {
  // They accepted a bot offer below current floor price
  if (didSellBelowFloor) {
    return 'Below Floor'
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

export function getProfitThresholdETH(floorPrice: number): number {
  // If no floor price available for collection
  // Default to 2 ETH profit threshold
  if (!floorPrice || floorPrice == 0) {
    return 2
  }

  // For larger collection where floor price is more than 50 ETH
  // We choose a smaller threshold since the margins are really big
  if (floorPrice > 50) {
    return rounded(floorPrice * 0.1)
  }

  // For mid-sized collection where floor price is more than 5 ETH
  // We choose a medium threshold since the margins aren't that big
  if (floorPrice > 5) {
    return rounded(floorPrice * 0.25)
  }

  // By defualt for all other collections have a 2 ETH profit threshold
  return 2
}
