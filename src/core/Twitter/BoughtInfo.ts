import { addCommas } from "../../shared/Formatters"

export const BoughtInfo = (boughtPriceETH, sale) => {
  // Get formatted bought ETH price 
  const boughtPriceETHFormatted = addCommas(boughtPriceETH)

  return `🛒 in: ${boughtPriceETHFormatted} ${sale.paymentToken.symbol}\n`
}
