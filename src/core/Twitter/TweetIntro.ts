import { getShortWalletAddress } from '../../utils/Crypto'

export const TweetIntro = (
  collection,
  tokenId,
  isProfit,
  sellerAddress,
  sellerUsername
) => {
  // Get Sale type
  const saleTypeTitle = isProfit ? '↗️ flipped ↗️' : '↘️ fumbled ↘️'

  // Get Collection Name
  const collectionSymbol = collection.displaySymbol ?? collection.symbol

  // Get seller name
  const sellerWallet = getShortWalletAddress(sellerAddress)
  const sellerName = sellerUsername || sellerWallet

  return `👀 ${sellerName} ${saleTypeTitle} ${collectionSymbol} #${tokenId}\n`
}
