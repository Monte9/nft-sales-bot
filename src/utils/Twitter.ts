import CoinbaseAPI from "../api/CoinbaseAPI";

import { Sale } from "../types/OpenSeaSale";
import { addCommas, getDaysBetween, getShortWalletAddress } from "../shared/Formatters";
import { isError } from "./Helpers";

interface NamedParameters {
  purchase: Sale
  sale: Sale
  coinbaseAPI: CoinbaseAPI
}

// Composes a tweet using the Sale information
export async function composeTweet({ purchase, sale, coinbaseAPI }: NamedParameters): Promise<String | Error> {
  // Get rounded Bought & Sold price in ETH
  const boughtPrice = Math.round(purchase.salePrice * 100) / 100
  const soldPrice = Math.round(sale.salePrice * 100) / 100

  // Get formatted Bought & Sold dates
  const boughtDate = purchase.transaction.timestamp
  const soldDate = sale.transaction.timestamp

  // Get HODL Duration
  const hodlDuration = getDaysBetween(soldDate, boughtDate)

  // Get the ETH price for Bought & Sold dates
  const boughtETHPrice = await coinbaseAPI.getUSDPriceForETH(boughtDate)
  const soldETHPrice = await coinbaseAPI.getUSDPriceForETH(soldDate)
  if (isError(boughtETHPrice) || isError(soldETHPrice)) {
    throw new Error("Unable to get ETH/USD value from Coinbase API")
  }

  // Get formatted ETH price for Bought & Sold dates
  const boughtETHPriceNumber = Number(boughtETHPrice)
  const boughtETHPriceFormatted = addCommas(boughtETHPriceNumber)
  const soldETHPriceNumber = Number(soldETHPrice)
  const soldETHPriceFormatted = addCommas(soldETHPriceNumber)

  // Get absolute Bought & Sold price in USD
  const boughtPriceUSD = purchase.salePrice * boughtETHPriceNumber
  const soldPriceUSD = sale.salePrice * soldETHPriceNumber

  // Missing BoughtPrice or SoldPrice
  if (boughtPrice <= 0 || soldPrice <= 0) {
    console.log(`Bought Price ${boughtPrice} ETH / $${boughtETHPriceFormatted} USD`)
    console.log(`Sold Price ${soldPrice} ETH / $${soldETHPriceFormatted} USD`)
    console.log("OpenSea Link:", sale.asset.link)
    throw new Error("Bought or Sold Price missing")
  }
  
  // Get the Profit/Loss value in USD
  const profitLossUSD = Math.round(soldPriceUSD - boughtPriceUSD)
  const profitLossUSDFormatted = addCommas(profitLossUSD)

  // Get the Flip Percentage
  const flipPercentage = ((soldPriceUSD - boughtPriceUSD) / boughtPriceUSD) * 100
  const flipPercentageRounded = Math.round(flipPercentage * 100) / 100

  // Report all losses OR only if profit is > $5000
  if (flipPercentageRounded > 0 && profitLossUSD < 5000) {
    console.log(`Bought Price ${boughtPrice} ETH / $${boughtETHPriceFormatted} USD`)
    console.log(`Sold Price ${soldPrice} ETH / $${soldETHPriceFormatted} USD`)
    console.log("Profit Loss:", profitLossUSDFormatted)
    console.log("OpenSea Link:", sale.asset.link)
    throw new Error("Profit/Loss USD value under $5K")
  }

  // Get the Profit/Loss labels
  const isProfitLoss = flipPercentageRounded > 0 ? 'PROFIT' : 'LOSS'
  const isProfitLossEmoji = flipPercentageRounded > 0 ? '🚀' : '🧐'
  const isProfitLossPercentageEmoji = flipPercentageRounded > 0 ? '📈 +' : '📉 -'

  // Get Twitter Username of the NFT Collection
  let twitterUsername = sale.asset.collection.twitterUsername
  if (!twitterUsername) {
    twitterUsername = sale.asset.collection.name
  }

  // Get Seller Username or Wallet address
  const seller = sale.seller
  const sellerWallet = getShortWalletAddress(seller.address)
  const sellerName = seller.username || sellerWallet

  // Format the Tweet content
  const intro = `${sellerName} FLIPPED ${twitterUsername} #${sale.asset.tokenId}\n\n`
  const boughtInfo = `🛍 Bought @ ${boughtPrice} ${sale.paymentToken.symbol} ($${boughtETHPriceFormatted}/ETH)\n`
  const soldInfo = `💰 Sold @ ${soldPrice} ${sale.paymentToken.symbol} ($${soldETHPriceFormatted}/ETH)\n`
  const hodlInfo = `🤝 HODL Duration: ${hodlDuration}\n`
  const flipInfo = `${isProfitLossEmoji} ${isProfitLoss}: $${profitLossUSDFormatted} (${isProfitLossPercentageEmoji}${Math.abs(flipPercentageRounded)}%)\n`
  const openSeaLink = `${sale.asset.link}`
  return intro + boughtInfo + soldInfo + hodlInfo + flipInfo + openSeaLink
}
