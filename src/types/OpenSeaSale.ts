export interface Collection {
  name: string
  twitterUsername?: string
  slug: string
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
}
