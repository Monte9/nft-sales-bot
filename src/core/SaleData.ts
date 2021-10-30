import CoinbaseAPI from "../api/CoinbaseAPI"

import { Sale, SaleData } from "../types"

import { SUPPORTED_PAYMENT_TOKEN_SYMBOLS } from "../shared/Constants"
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
    console.log("OpenSea Link:", sale.asset.link)
    throw new Error("missing bought or sold price")
  }

  // Get the Profit/Loss value in ETH
  const profitLossETH = rounded(soldPriceETH - boughtPriceETH)

  // isProfit is only calcuated in ETH
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
    isProfit,
    profitLossETH,
    hodlDays,
    flipValueUSD,
    flipPercentageUSD,
  }
}

function addStatus(currentStatus: string, newStatus: string) {
  if (currentStatus.length > 0) {
    return currentStatus + ` & ${newStatus}`
  }

  return newStatus
}

export function getSaleTypeInfo(isProfit: boolean, profitLossETH: number, hodlDays: number, flipValueUSD: number) {
  let status = '';

  if (hodlDays === 1) {
    status = addStatus(status, 'Pancake')
  } else if (hodlDays < 5) {
    status = addStatus(status, 'Rapid')
  } else if (hodlDays < 10) {
    status = addStatus(status, 'Quick')
  } else if (hodlDays < 30) {
    status = addStatus(status, 'Swift')
  } else if (hodlDays < 180) {
    status = addStatus(status, 'Thoughtful')
  } else if (hodlDays < 365) {
    status = addStatus(status, 'Calculated')
  } else {
    status = addStatus(status, 'Diamond Hands')
  }

  if (flipValueUSD < 0 && isProfit) {
    status = addStatus(status, 'Tax Loss Harvesting')
  } else if (profitLossETH > 1000) {
    status = addStatus(status, 'God Tier')
  } else if (profitLossETH > 500) {
    status = addStatus(status, 'Ready to Retire')
  } else if (profitLossETH > 250) {
    status = addStatus(status, 'Life-Changing')
  } else if (profitLossETH > 100) {
    status = addStatus(status, 'Exceptional Flip')
  } else if (profitLossETH > 75) {
    status = addStatus(status, 'Expert Flip')
  } else if (profitLossETH > 50) {
    status = addStatus(status, 'Incredible Flip')
  } else if (profitLossETH > 25) {
    status = addStatus(status, 'Excellent Flip')
  } else if (profitLossETH > 10) {
    status = addStatus(status, 'Good Flip')
  } else if (profitLossETH > 5) {
    status = addStatus(status, "It's Alright")
  } else if (profitLossETH > 2) {
    status = addStatus(status, 'Be More Ambitious')
  } else if (profitLossETH < -10) {
    status = addStatus(status, 'Noodle Hands')
  } else if (profitLossETH < -5) {
    status = addStatus(status, 'Paper Hands')
  } else if (profitLossETH < -2) {
    status = addStatus(status, 'Weak Hands')
  } else {
    status = addStatus(status, 'Noob Flip')
  }

  return status
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
