export const DEFAULT_WALLET_ADDRESS = "0x0000000000000000000000000000000000000000"

// This mint price for BAYC in WEI - 0.08 ETH
export const BAYC_MINT_PRICE_WEI = 80000000000000000

// The mint price for CloneX in Wei - 2 ETH
export const CLONE_X_MINT_PRICE_WEI = 2000000000000000000

export const getShortWalletAddress = (address): string => {
  return address.slice(0, 6) + '..' + address.substr(address.length - 4)
}
