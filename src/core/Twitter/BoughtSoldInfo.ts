import { addCommas } from '../../utils/String'

export const BoughtSoldInfo = (boughtPriceETH, soldPriceETH, sale) => {
  // Get formatted bought ETH price
  const boughtPriceETHFormatted = addCommas(boughtPriceETH)
  const soldPriceETHFormatted = addCommas(soldPriceETH)

  return `🛒 ${boughtPriceETHFormatted} ${sale.paymentToken.symbol} ➡️ ${soldPriceETHFormatted} ${sale.paymentToken.symbol}`
}
