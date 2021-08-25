import { CollectionSlug, CollectionSymbol } from "../shared/Constants";

export interface OpenSeaCollection {
  address: string
  name: string
  symbol: CollectionSymbol
  slug: CollectionSlug
  stats: CollectionStats
  ownedAssetCount: number
  twitterUsername?: string
}

export interface CollectionStats {
  totalSupply?: number
  numOwners?: number
  averagePrice?: number
  floorPrice: number
}
