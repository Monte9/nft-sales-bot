export function TweetStatus(isProfit: boolean, profitLossETH: number, hodlDays: number, flipValueUSD: number) {
  let status = '';

  if (hodlDays === 1) {
    status = addStatus(status, 'Pancake')
  } else if (hodlDays < 5) {
    status = addStatus(status, 'Rapid')
  } else if (hodlDays < 10) {
    status = addStatus(status, 'Quick')
  } else if (hodlDays < 30) {
    status = addStatus(status, 'Swift')
  } else if (hodlDays < 180) {
    status = addStatus(status, 'Thoughtful')
  } else if (hodlDays < 365) {
    status = addStatus(status, 'Calculated')
  } else {
    status = addStatus(status, 'Diamond Hands')
  }

  if (flipValueUSD < 0 && isProfit) {
    status = addStatus(status, 'Tax Loss Harvesting')
  } else if (profitLossETH > 1000) {
    status = addStatus(status, 'God Tier')
  } else if (profitLossETH > 500) {
    status = addStatus(status, 'Ready to Retire')
  } else if (profitLossETH > 250) {
    status = addStatus(status, 'Life-Changing')
  } else if (profitLossETH > 100) {
    status = addStatus(status, 'Exceptional Flip')
  } else if (profitLossETH > 75) {
    status = addStatus(status, 'Expert Flip')
  } else if (profitLossETH > 50) {
    status = addStatus(status, 'Incredible Flip')
  } else if (profitLossETH > 25) {
    status = addStatus(status, 'Excellent Flip')
  } else if (profitLossETH > 10) {
    status = addStatus(status, 'Good Flip')
  } else if (profitLossETH > 5) {
    status = addStatus(status, "It's Alright")
  } else if (profitLossETH > 2) {
    status = addStatus(status, 'Be More Ambitious')
  } else if (profitLossETH < -10) {
    status = addStatus(status, 'Fatality')
  } else if (profitLossETH < -5) {
    status = addStatus(status, 'Noodle Hands')
  } else if (profitLossETH < -2) {
    status = addStatus(status, 'Paper Hands')
  } else if (profitLossETH < -2) {
    status = addStatus(status, 'Weak Hands')
  } else {
    status = addStatus(status, 'Noob Flip')
  }

  return `🏆 Status: ${status}\n`
}

function addStatus(currentStatus: string, newStatus: string) {
  if (currentStatus.length > 0) {
    return currentStatus + ` & ${newStatus}`
  }

  return newStatus
}
