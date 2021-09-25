import { CollectionSlug } from "../shared/Constants";

// SALES BOT

export interface SalesBot {
  collection: Collection
  oldSalesIds: number[]
  floorPrice?: number
}

// COLLECTION

export interface Collection {
  address: string
  symbol: string
  name: string
  twitterUsername?: string
  slug: CollectionSlug
  profitThreshold?: number
  alternateNames: string[]
}

// SALE

export interface Sale {
  asset: Asset
  seller: User
  buyer: User
  paymentToken?: PaymentToken
  salePrice: number
  saleId: number
  transaction: Transaction
}

export interface Asset {
  name: string
  tokenId: string
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
  name: string
  imageUrl: string
  decimals: number
  usdPrice: number
}

export interface Transaction {
  id: number
  block_hash: string
  block_number: string
  timestamp: string
  transaction_hash: string
  transaction_index: string
}

// FLOOR PRICE

export interface FloorPrice {
  name?: string
  currentFloor: number
  lastUpdated?: string
  activityUrl?: string
  url?: string
}

// SALES DATA

export interface SaleData {
  tokenId: string
  sellerName: string
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
