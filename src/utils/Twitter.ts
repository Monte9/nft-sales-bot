import { Sale } from "../types/OpenSeaSale";
import { addCommas, getDateFromISOString, getDaysBetween, getShortWalletAddress } from "../shared/Formatters";

// Composes a tweet using the Sale information
export function composeTweet(purchase: Sale, sale: Sale): String | null {
  // Get rounded Bought & Sold price
  const boughtPrice = Math.round(purchase.salePrice * 100) / 100
  const soldPrice = Math.round(sale.salePrice * 100) / 100

  // Get formatted Bought & Sold date
  const boughtDate = getDateFromISOString(purchase.transaction.timestamp)
  const soldDate = getDateFromISOString(sale.transaction.timestamp)

  console.log('Bought', boughtDate)
  console.log('Sold', soldDate)
  const hodlDuration = getDaysBetween(sale.transaction.timestamp, purchase.transaction.timestamp)

  // Missing BoughtPrice or SoldPrice
  if (boughtPrice <= 0 || soldPrice <= 0) {
    console.log("Bought Price:", boughtPrice)
    console.log("Sold Price:", soldPrice)
    console.log("OpenSea Link:", sale.asset.link)
    throw new Error("Bought or Sold Price missing")
  }
  
  // Get the Profit/Loss value in USD
  const profitLossValue = Math.abs(soldPrice - boughtPrice)
  const profitLossUSD = Math.round(profitLossValue * sale.paymentToken.usdPrice)
  const profitLossUSDFormatted = addCommas(profitLossUSD)

  // Get the Flip Percentage
  const flipPercentage = ((soldPrice - boughtPrice) / boughtPrice) * 100
  const flipPercentageRounded = Math.round(flipPercentage * 100) / 100

  // Report all losses OR only if profit is > $5000
  if (flipPercentageRounded > 0 && profitLossUSD < 5000) {
    console.log("Bought Price:", boughtPrice)
    console.log("Sold Price:", soldPrice)
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
  const boughtInfo = `🛍 Bought @ ${boughtPrice} ${sale.paymentToken.symbol}\n`
  const soldInfo = `💰 Sold @ ${soldPrice} ${sale.paymentToken.symbol}\n`
  const hodlInfo = `🤝 HODL Duration: ${hodlDuration}\n`
  const flipInfo = `${isProfitLossEmoji} ${isProfitLoss}: $${profitLossUSDFormatted} (${isProfitLossPercentageEmoji}${Math.abs(flipPercentageRounded)}%)\n`
  const openSeaLink = `${sale.asset.link}`
  return intro + boughtInfo + soldInfo + hodlInfo + flipInfo + openSeaLink
}
