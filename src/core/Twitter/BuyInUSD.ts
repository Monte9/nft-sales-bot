import { addCommas, getShortDate } from "../../shared/Formatters"

export const BuyInUSD = (flipPercentageUSD, boughtPriceETH, boughtDateETHPrice, boughtDate) => {
  if (flipPercentageUSD === 0) {
    return ''
  }
  
  const isUSDProfitLoss = flipPercentageUSD >= 0 ? '💲 paid' : '💲 spent'
  const buyInUSD = addCommas(Math.round(boughtPriceETH * boughtDateETHPrice))
  const formattedDate = getShortDate(boughtDate)

  return `${isUSDProfitLoss}: $${buyInUSD} (${formattedDate})\n`
}
