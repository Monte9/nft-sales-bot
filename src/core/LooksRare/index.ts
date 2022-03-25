import moment from 'moment-timezone'

import CoinbaseAPI from '../../api/CoinbaseAPI'
import { TweetStatus } from '../Twitter/TweetStatus'
import { LooksRareTransaction } from '../../types'
import { getLooksRareTokenURL } from '../../utils/LooksRare'
import { addCommas } from '../../utils/String'

interface ComposeLooksRareTweetParams {
  transaction: LooksRareTransaction
  coinbaseAPI: CoinbaseAPI
}

// Composes tweet for a LooksRare transaction
export async function composeLooksRareTweet({
  transaction,
  coinbaseAPI
}: ComposeLooksRareTweetParams): Promise<string> {
  const intro = `🚨 New LooksRare Sale\n\n`

  const link = getLooksRareTokenURL(
    transaction.collection.id,
    transaction.tokenId
  )

  const date = Number(transaction.date)
  const soldDate = moment(date * 1000).format('YYYY-MM-DDTHH:mm:ss')

  // Get the ETH prices on sold dates
  try {
    const soldDateETHPrice = await coinbaseAPI.getUSDPriceForETH(soldDate)

    // Get the sold prices in ETH & USD
    const price = Number(transaction.price)
    const soldPriceUSD = Math.round(price * soldDateETHPrice)
    const salePrice = `💰 sale: ${addCommas(price)} ETH = $${addCommas(
      Math.round(soldPriceUSD)
    )}\n`

    // Get the status
    const status = TweetStatus(false, price, 0, 0) + '\n'

    return intro + status + salePrice + link
  } catch (error) {
    throw new Error(
      `unable to fetch ETH price for Sold date ${soldDate} | ${link}`
    )
  }
}
