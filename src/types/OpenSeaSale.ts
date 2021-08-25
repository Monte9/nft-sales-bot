import { CollectionSlug, CollectionSymbol } from "../shared/Constants";

export interface Collection {
  address?: string
  symbol: CollectionSymbol
  name: string
  twitterUsername?: string
  slug: CollectionSlug
  profitThreshold?: number
}

export interface Asset {
  tokenId: string
  image: string
  link: string
  collection: Collection
}

export interface User {
  username?: string
  address: string
}

export interface Transaction {
  id: number
  block_hash: string
  block_number: string
  timestamp: string
  transaction_hash: string
  transaction_index: string
}

export interface PaymentToken {
  symbol: string
  name: string
  imageUrl: string
  decimals: number
  usdPrice: number
}

export interface Sale {
  asset: Asset
  seller: User
  buyer: User
  paymentToken?: PaymentToken
  salePrice: number
  saleId: number
  transaction: Transaction
}
