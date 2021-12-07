import { addCommas } from "../../shared/Formatters"

export const FlipInfoETH = (isProfit, absoluteProfitLossETH) => {
  // Get the Profit/Loss labels
  const isETHProfitLoss = isProfit ? '  Ξ  PROFIT' : '  Ξ  LOSS'

  if (absoluteProfitLossETH == 0) {
    return ''
  }

  // Get the profitLossETH value
  const absoluteProfitLossETHFormatted = addCommas(absoluteProfitLossETH)
  return `${isETHProfitLoss}: ${absoluteProfitLossETHFormatted} ETH\n`
}
