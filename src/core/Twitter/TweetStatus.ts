export function TweetStatus(
  isProfit: boolean,
  profitLossETH: number,
  hodlDays: number,
  flipValueUSD: number
) {
  const status = '🏆 status: '

  // If HODL is more than 8 months
  if (hodlDays >= 240) {
    return status + 'Diamond Hands'
  }

  // If ETH profit but dollar loss
  if (flipValueUSD < 0 && isProfit) {
    return status + 'Tax Loss Harvesting'
  }

  if (profitLossETH < -10) {
    return status + 'No Hands'
  }

  if (profitLossETH < -5) {
    return status + 'Noodle Hands'
  }

  if (profitLossETH < -2) {
    return status + 'Weak Hands'
  }

  if (profitLossETH > 300) {
    return status + 'Legend'
  }

  if (profitLossETH > 150) {
    return status + 'Master'
  }

  if (profitLossETH > 75) {
    return status + 'Elite'
  }

  if (profitLossETH > 50) {
    return status + 'Diamond'
  }

  if (profitLossETH > 25) {
    return status + 'Emerald'
  }

  if (profitLossETH > 10) {
    return status + 'Gold'
  }

  if (profitLossETH > 5) {
    return status + 'Silver'
  }

  if (profitLossETH > 2) {
    return status + 'Bronze'
  }

  return status + 'Rookie'
}
