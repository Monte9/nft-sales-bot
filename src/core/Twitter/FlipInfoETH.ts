import { addCommas } from "../../shared/Formatters"

export const FlipInfoETH = (isProfit, absoluteProfitLossETH) => {
  // Get the Profit/Loss labels
  const isETHProfitLoss = isProfit ? ' Ξ  profit' : ' Ξ  loss'
  const profitLossSymbol = isProfit ? '+' : '-'
  const profitLossEmoji = isProfit ? '🔥' : '❌'

  if (absoluteProfitLossETH == 0) {
    return ''
  }

  // Get the profitLossETH value
  const absoluteProfitLossETHFormatted = addCommas(absoluteProfitLossETH)
  return `${isETHProfitLoss}: ${profitLossSymbol}${absoluteProfitLossETHFormatted} ETH ${profitLossEmoji}\n`
}
