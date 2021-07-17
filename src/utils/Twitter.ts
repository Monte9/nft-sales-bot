import { Sale } from "../types/OpenSeaSale";
import { addCommas } from "../shared/Formatters";

// Composes a tweet using the Sale information
export function composeTweet(sale: Sale, boughtPrice: number): String | null {
  // Get Seller & Sale Price
  const seller = sale.seller
  const salePrice = sale.salePrice

  // Missing SalePrice or BoughtPrice
  if (salePrice < 1 || boughtPrice < 1 ) {
    return null
  }
  
  // Get the Profit/Loss value in USD
  const profitLossValue = Math.abs(salePrice - boughtPrice)
  const profitLossUSD = Math.round(profitLossValue * sale.paymentToken.usdPrice)
  const profitLossUSDFormatted = addCommas(profitLossUSD)

  // Only report sales where profit is > $5000
  if (profitLossUSD < 5000 ) {
    return null
  }

  // Get the Flip Percentage
  const flipPercentage = ((salePrice - boughtPrice) / boughtPrice) * 100
  const flipPercentageRounded = Math.round(flipPercentage * 100) / 100

  // Get the Profit/Loss labels
  const isProfitLoss = flipPercentageRounded > 0 ? 'PROFIT' : 'LOSS'
  const isProfitLossEmoji = flipPercentageRounded > 0 ? '📈 +' : '📉 -'

  // Get Twitter Username of the NFT Collection
  let twitterUsername = sale.asset.collection.twitterUsername
  if (!twitterUsername) {
    twitterUsername = sale.asset.collection.name
  }

  // Get Seller Username or Wallet address 
  const sellerAddressShort = seller.address.slice(0, 5) + '...' + seller.address.substr(seller.address.length - 4);
  const sellerName = seller.username || sellerAddressShort

  // Compose the Tweet content
  return `${sellerName} FLIPPED ${twitterUsername} #${sale.asset.tokenId} for a ${isProfitLoss} of $${profitLossUSDFormatted} (${isProfitLossEmoji}${Math.abs(flipPercentageRounded)}%)\n${sale.asset.link}`
}
