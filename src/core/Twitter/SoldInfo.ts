import { addCommas } from '../../utils/String'

export const SoldInfo = (soldPriceETH, sale) => {
  // Get formatted sold ETH price
  const soldPriceETHFormatted = addCommas(soldPriceETH)

  return `💰 out: ${soldPriceETHFormatted} ${sale.paymentToken.symbol}\n`
}
