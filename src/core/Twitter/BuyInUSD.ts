import { getShortDate } from '../../utils/DateTime'
import { addCommas } from '../../utils/String'

export const BuyInUSD = (
  flipPercentageUSD,
  boughtPriceETH,
  boughtDateETHPrice,
  boughtDate
) => {
  if (flipPercentageUSD === 0) {
    return ''
  }

  const buyInUSD = addCommas(Math.round(boughtPriceETH * boughtDateETHPrice))
  const formattedDate = getShortDate(boughtDate)

  return `💸 paid: $${buyInUSD} (${formattedDate})`
}
