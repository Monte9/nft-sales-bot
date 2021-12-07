import { addCommas } from "../../shared/Formatters"

export const FlipInfoUSD = (flipPercentageUSD, flipValueUSD) => {
  if (flipPercentageUSD === 0 || flipValueUSD === 0) {
    return ''
  }
  
  const isUSDProfitLoss = flipPercentageUSD >= 0 ? '💲 PROFIT' : '💲 LOSS'
  const isProfitLossPercentageEmoji = flipPercentageUSD >= 0 ? '📈 +' : '📉 -'
  const isUSDProfitLossSymbol = flipPercentageUSD >= 0 ? '' : '-'

  // Get formatted Profit/Loss value in USD
  const flipValueUSDFormatted = addCommas(Math.abs(flipValueUSD))
  const flipPercentageUSDFormatted = addCommas(Math.abs(flipPercentageUSD))

  return `${isUSDProfitLoss}: ${isUSDProfitLossSymbol}$${flipValueUSDFormatted} (${isProfitLossPercentageEmoji}${flipPercentageUSDFormatted}%)\n`
}
