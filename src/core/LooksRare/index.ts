import CoinbaseAPI from "../../api/CoinbaseAPI";

import { LooksRareTransaction } from "../../types";
import { getLooksRareTokenURL } from "../../shared/Helpers";
import moment from "moment-timezone";
import { addCommas } from "../../shared/Formatters";

interface ComposeLooksRareTweetParams {
  transaction: LooksRareTransaction,
  coinbaseAPI: CoinbaseAPI
}

// Composes tweet for a LooksRare transaction
export async function composeLooksRareTweet({ transaction, coinbaseAPI }: ComposeLooksRareTweetParams): Promise<string> {
  const intro = `🚨 New LooksRare Sale\n\n`

  const link = getLooksRareTokenURL(transaction.collection.id, transaction.tokenId)

  const date = Number(transaction.date)
  const soldDate = moment(date* 1000).format('YYYY-MM-DDTHH:mm:ss')

  // Get the ETH prices on sold dates
  try {
    var soldDateETHPrice = await coinbaseAPI.getUSDPriceForETH(soldDate)
  } catch (error) {
    throw new Error(`unable to fetch ETH price for Sold date ${soldDate} | ${link}`)
  }

  // Get the status
  const status = `🏆 status: ${getStatus(transaction)}\n`

  // Get the sold prices in ETH & USD
  const price = Number(transaction.price)
  const soldPriceUSD = Math.round(price * soldDateETHPrice)
  const salePrice = `💰 sale: ${addCommas(price)} ETH = $${addCommas(Math.round(soldPriceUSD))}\n`

  return intro + status + salePrice + link
}

const getStatus = (transaction: LooksRareTransaction): string => {
  const price = Number(transaction.price)

  if (price > 500) {
    return 'Scandalous 🚔'
  } else if (price > 400) {
    return 'Mind-boggling 🤯'
  } else if (price > 300) {
    return 'Eye-popping 😵‍💫'
  } else if (price > 200) {
    return 'Staggering 😱'
  } else if (price > 100) {
    return '$LOOKS shady 👀'
  } else if (price > 50) {
    return 'Fishy 🎣'
  }
  
  return 'Try harder 😏'
}
