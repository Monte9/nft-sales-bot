import { addCommas } from "../../shared/Formatters"

export const SoldInfo = (soldPriceETH, soldDateETHPrice, sale) => {
  // Get formatted sold ETH price
  const soldPriceETHFormatted = addCommas(soldPriceETH)
  let priceInfoETH = `💰 Sold: ${soldPriceETHFormatted} ${sale.paymentToken.symbol}`

  if (soldDateETHPrice <= 0) {
    return priceInfoETH + '\n'
  }

  // Get formatted ETH price for sold date
  const soldDateETHPriceFormatted = addCommas(soldDateETHPrice)
  return priceInfoETH + ` @ $${soldDateETHPriceFormatted}\n`
}
