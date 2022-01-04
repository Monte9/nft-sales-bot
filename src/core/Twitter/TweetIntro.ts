import { getShortWalletAddress } from "../../shared/Formatters"

export const TweetIntro = (collectionSymbol, tokenId, isProfit, sellerAddress, sellerUsername) => {
  // Get Sale type
  const saleTypeTitle = isProfit ? '↗️  flipped ↗️ ' : '↘️ fumbled ↘️'

  // Get seller name
  const sellerWallet = getShortWalletAddress(sellerAddress)
  const sellerName = sellerUsername || sellerWallet

  return `👀 ${sellerName} ${saleTypeTitle} ${collectionSymbol} #${tokenId}\n`
}
