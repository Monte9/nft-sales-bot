import CoinbaseAPI from "../../api/CoinbaseAPI";

import { TweetIntro } from "./TweetIntro";
import { TweetStatus } from "./TweetStatus";
import { BoughtInfo } from "./BoughtInfo";
import { SoldInfo } from "./SoldInfo";
import { HodlInfo } from "./HodlInfo";
import { FlipInfoETH } from "./FlipInfoETH";
import { FlipInfoUSD } from "./FlipInfoUSD";

import { getProfitThresholdETH, getSaleData } from "../SaleData";

import { Collection, Sale, SaleData } from "../../types";

import { CollectionSlug } from "../../shared/Constants";

interface ComposeTweetParams {
  collection: Collection
  purchase: Sale
  sale: Sale
  floorPrice?: number
  coinbaseAPI: CoinbaseAPI
}

// Composes a tweet using the Sale information
export async function composeTweet({ collection, purchase, sale, coinbaseAPI, floorPrice = 0 }: ComposeTweetParams): Promise<string> {
  // TODO: This doesn't actually fix the bug
  // https://twitter.com/nftsalesbot/status/1467826298030632961
  if (sale.salePrice === 0 && collection.slug === CollectionSlug.cryptopunks) {
    throw new Error("Punks interacting with contract")
  }

  try {
    var salesData: SaleData = await getSaleData({ purchase, sale, coinbaseAPI })
  } catch(error) {
    throw error
  }
  
  // Get the Sales Data
  const {
    tokenId, openSeaLink, isProfit, 
    boughtPriceETH, boughtDate, boughtDateETHPrice,
    soldPriceETH, soldDate, soldDateETHPrice,
    hodlDays, profitLossETH, 
    flipValueUSD, flipPercentageUSD
  } = salesData

  // Get the absolute profit/loss without the minus sign for losses
  const absoluteProfitLossETH = Math.abs(profitLossETH)

  // Ignore loses < 1 ETH
  if (!isProfit && absoluteProfitLossETH < 1) {
    throw new Error(`${profitLossETH} ETH fumble (threshold -1 ETH) | ${openSeaLink}`)
  }

  // Dynamically get the Profit Threshold for the collection based on floor prices
  const profitThresholdETH = getProfitThresholdETH(floorPrice)

  // Ignore sales that are less than profitThresholdETH for the collection
  if (isProfit && profitLossETH < profitThresholdETH) {
    throw new Error(`${profitLossETH} ETH flip (threshold ${profitThresholdETH} ETH) | ${openSeaLink}`)
  }

  // Check whether they sold below floor - accepted a bot offer
  // const didSellBelowFloor = sale.salePrice < floorPrice

  // Return Tweet content
  return (
    TweetIntro(collection.symbol, tokenId, isProfit, salesData.sellerAddress, salesData.sellerUsername) + '\n' +
    TweetStatus(isProfit, profitLossETH, hodlDays, flipValueUSD) + '\n' +
    BoughtInfo(boughtPriceETH, boughtDateETHPrice, sale) +
    SoldInfo(soldPriceETH, soldDateETHPrice, sale) +
    HodlInfo(soldDate, boughtDate) + '\n' +
    FlipInfoETH(isProfit, absoluteProfitLossETH) +
    FlipInfoUSD(flipPercentageUSD, flipValueUSD)  + '\n' + 
    openSeaLink
  )
}
