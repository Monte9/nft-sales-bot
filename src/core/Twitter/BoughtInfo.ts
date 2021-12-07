import { addCommas } from "../../shared/Formatters"

export const BoughtInfo = (boughtPriceETH, boughtDateETHPrice, sale) => {
  // Get formatted bought ETH price 
  const boughtPriceETHFormatted = addCommas(boughtPriceETH)
  let priceInfoETH = `🛍 Bought: ${boughtPriceETHFormatted} ${sale.paymentToken.symbol}`

  if (boughtDateETHPrice <= 0) {
    return priceInfoETH + '\n'
  }

  // Get formatted ETH price for bought date
  const boughtDateETHPriceFormatted = addCommas(boughtDateETHPrice)
  return priceInfoETH + ` @ $${boughtDateETHPriceFormatted}\n`
}
