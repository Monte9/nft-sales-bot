import { Sale } from "../types/OpenSeaSale";
import { addCommas } from "../shared/Formatters";

// Composes a tweet using the Sale information
export function composeTweet(sale: Sale, boughtPrice: number): String | null {
  // Get Sale Price
  const salePrice = sale.salePrice

  // Missing SalePrice or BoughtPrice
  if (salePrice <= 0 || boughtPrice <= 0 ) {
    console.log("Sale Price:", salePrice)
    console.log("Bought Price:", boughtPrice)
    console.log("OpenSea Link:", sale.asset.link)
    throw new Error("Sale Price or Bought Price missing")
  }
  
  // Get the Profit/Loss value in USD
  const profitLossValue = Math.abs(salePrice - boughtPrice)
  const profitLossUSD = Math.round(profitLossValue * sale.paymentToken.usdPrice)
  const profitLossUSDFormatted = addCommas(profitLossUSD)

  // Get the Flip Percentage
  const flipPercentage = ((salePrice - boughtPrice) / boughtPrice) * 100
  const flipPercentageRounded = Math.round(flipPercentage * 100) / 100

  // Report all losses OR only if profit is > $5000
  if (flipPercentageRounded > 0 && profitLossUSD < 5000) {
    console.log("Sale Price:", salePrice)
    console.log("Bought Price:", boughtPrice)
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
  const sellerAddressShort = seller.address.slice(0, 6) + '..' + seller.address.substr(seller.address.length - 4);
  const sellerName = seller.username || sellerAddressShort

  // Format the Tweet content
  const intro = `${sellerName} FLIPPED ${twitterUsername} #${sale.asset.tokenId}\n\n`
  const boughtInfo = `🛍 Bought @ ${boughtPrice} ${sale.paymentToken.symbol}\n`
  const soldInfo = `💰 Sold @ ${salePrice} ${sale.paymentToken.symbol}\n`
  const hodlInfo = `🤝 HODL Duration: Coming soon\n`
  const flipInfo = `${isProfitLossEmoji} ${isProfitLoss}: $${profitLossUSDFormatted} (${isProfitLossPercentageEmoji}${Math.abs(flipPercentageRounded)}%)\n`
  const openSeaLink = `${sale.asset.link}`
  return intro + boughtInfo + soldInfo + hodlInfo + flipInfo + openSeaLink
}
