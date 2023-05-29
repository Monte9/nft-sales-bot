import CoinbaseAPI from '../api/CoinbaseAPI'
import { Sale, SaleData } from '../types'
import { SUPPORTED_PAYMENT_TOKEN_SYMBOLS } from '../shared/Constants'
import { rounded } from '../utils/Number'
import { getTotalDaysBetween } from '../utils/DateTime'

interface SaleDataParams {
  purchase: Sale
  sale: Sale
  coinbaseAPI: CoinbaseAPI
}

export async function getSaleData({
  purchase,
  sale,
  coinbaseAPI
}: SaleDataParams): Promise<SaleData> {
  // Get Token ID & OpenSea Link
  const tokenId = Number(sale.asset.tokenId)
  const openSeaLink = sale.asset.link

  // Get Seller Username or Wallet address
  const seller = sale.seller
  const sellerAddress = seller.address
  const sellerUsername = seller.username

  const purchaseToken =
    (purchase.paymentToken && purchase.paymentToken.symbol) || 'ETH'
  const saleToken = (sale.paymentToken && sale.paymentToken.symbol) || 'ETH'

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
    var boughtDateETHPrice = await coinbaseAPI.getUSDPriceForETH(boughtDate)
    var soldDateETHPrice = await coinbaseAPI.getUSDPriceForETH(soldDate)
  } catch (error) {
    throw new Error(
      `unable to fetch ETH price for Bought date ${boughtDate} or Sold date ${soldDate} | ${sale.asset.link}`
    )
  }

  // Get the bought & sold prices in USD
  const boughtPriceUSD = Math.round(boughtPriceETH * boughtDateETHPrice)
  const soldPriceUSD = Math.round(soldPriceETH * soldDateETHPrice)

  // Get the flip profit or loss value in USD & the flip percentage
  if (boughtPriceUSD === 0 || soldPriceUSD === 0) {
    var flipValueUSD = 0
  } else {
    flipValueUSD = Math.round(soldPriceUSD - boughtPriceUSD)
  }

  const flipPercentageUSD = Math.round((flipValueUSD / boughtPriceUSD) * 100)

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
    flipPercentageUSD
  }
}
