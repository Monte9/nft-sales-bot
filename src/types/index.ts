// SALES BOT

export interface SalesBot {
  collection: Collection
  oldSalesIds: string[]
}

// COLLECTION

export interface Collection {
  address: string
  name: string
  slug: string
  symbol: string
  displaySymbol?: string
  twitterUsername?: string
}

// SALE

export interface Sale {
  asset: Asset
  seller: User
  buyer: User
  paymentToken?: PaymentToken
  salePrice: number
  openseaSaleId: string
  timestamp: string
  transactionHash: string
}

export interface Asset {
  name: string
  tokenId: number
  image: string
  link: string
  collection: Collection
}

export interface User {
  username?: string
  address: string
}

export interface PaymentToken {
  symbol: string
  name?: string
  imageUrl?: string
  decimals: number
  usdPrice?: number
}

// SALES DATA

export interface SaleData {
  tokenId: number
  sellerAddress: string
  sellerUsername: string
  openSeaLink: string
  boughtPriceETH: number
  boughtPriceUSD: number
  boughtDate: string
  boughtDateETHPrice: number
  soldPriceETH: number
  soldPriceUSD: number
  soldDate: string
  soldDateETHPrice: number
  hodlDays: number
  profitLossETH: number
  isProfit: boolean
  flipValueUSD: number
  flipPercentageUSD: number
}
