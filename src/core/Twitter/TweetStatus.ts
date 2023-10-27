export function TweetStatus(
  isProfit: boolean,
  profitLossETH: number,
  hodlDays: number,
  flipValueUSD: number
) {
  const status = '🏆 status: '

  // If ETH profit but dollar loss
  if (flipValueUSD < 0 && isProfit) {
    return status + 'Tax Loss Harvesting'
  }

  if (profitLossETH < -10) {
    return status + 'No hands'
  }

  if (profitLossETH < -5) {
    return status + 'Noodle Hands'
  }

  if (profitLossETH < -2) {
    return status + 'Paper Hands'
  }

  if (profitLossETH < -1) {
    return status + 'Weak Hands'
  }

  // If HODL is more than 1 year
  if (profitLossETH > 10 && hodlDays >= 360) {
    return status + 'Diamond Hands'
  }

  if (profitLossETH > 100) {
    return status + 'Bruhhhhhhhhhhhhhhh'
  }

  if (profitLossETH > 150) {
    return status + 'Bruhhhhhhhhhhhh'
  }

  if (profitLossETH > 75) {
    return status + 'Bruhhhhhhhhh'
  }

  if (profitLossETH > 50) {
    return status + 'Bruhhhhhh'
  }

  if (profitLossETH > 25) {
    return status + 'Bruhhh'
  }

  if (profitLossETH > 10) {
    return status + 'Bruh'
  }

  if (profitLossETH > 5) {
    return status + 'Noice'
  }

  if (profitLossETH > 2) {
    return status + 'Meh'
  }

  return status + 'Noob'
}
