import CoinbaseAPI from '../../api/CoinbaseAPI'
import { TweetIntro } from './TweetIntro'
import { TweetStatus } from './TweetStatus'
import { BoughtInfo } from './BoughtInfo'
import { SoldInfo } from './SoldInfo'
import { HodlInfo } from './HodlInfo'
import { FlipInfoETH } from './FlipInfoETH'
import { BuyInUSD } from './BuyInUSD'
import { FlipInfoUSD } from './FlipInfoUSD'
import { getSaleData } from '../SaleData'
import { Collection, Sale, SaleData } from '../../types'

interface ComposeTweetParams {
  collection: Collection
  purchase: Sale
  sale: Sale
  coinbaseAPI: CoinbaseAPI
}

// Composes a tweet using the Sale information
export async function composeTweet({
  collection,
  purchase,
  sale,
  coinbaseAPI
}: ComposeTweetParams): Promise<string> {
  // When the sale price is missing, we default to 0.08
  // This happens when PUNKS interact with a smart contract
  if (sale.salePrice === 0.08) {
    throw new Error(`missing sale price | ${sale.asset.link}`)
  }

  // Get the Sale data for the NFT sale
  const salesData: SaleData = await getSaleData({ purchase, sale, coinbaseAPI })
  const {
    tokenId,
    openSeaLink,
    isProfit,
    boughtPriceETH,
    boughtDate,
    boughtDateETHPrice,
    soldPriceETH,
    soldDate,
    hodlDays,
    profitLossETH,
    flipValueUSD,
    flipPercentageUSD
  } = salesData

  // Get the absolute profit/loss without the minus sign for losses
  const absoluteProfitLossETH = Math.abs(profitLossETH)

  // Ignore loses < 1 ETH
  if (!isProfit && absoluteProfitLossETH < 1) {
    throw new Error(
      `${profitLossETH} ETH fumble (threshold -1 ETH) | ${openSeaLink}`
    )
  }

  // Ignore sales that are less than 1 ETH in profit for the collection
  if (isProfit && profitLossETH < 1) {
    throw new Error(
      `${profitLossETH} ETH flip (threshold 1 ETH) | ${openSeaLink}`
    )
  }

  // Return Tweet content
  return (
    TweetIntro(
      collection,
      tokenId,
      isProfit,
      salesData.sellerAddress,
      salesData.sellerUsername
    ) +
    openSeaLink +
    '\n\n' +
    TweetStatus(isProfit, profitLossETH, hodlDays, flipValueUSD) +
    '\n' +
    BoughtInfo(boughtPriceETH, sale) +
    SoldInfo(soldPriceETH, sale) +
    HodlInfo(soldDate, boughtDate) +
    '\n' +
    FlipInfoETH(isProfit, absoluteProfitLossETH) +
    '\n' +
    BuyInUSD(
      flipPercentageUSD,
      boughtPriceETH,
      boughtDateETHPrice,
      boughtDate
    ) +
    FlipInfoUSD(flipPercentageUSD, flipValueUSD)
  )
}
