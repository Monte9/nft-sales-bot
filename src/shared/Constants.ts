import { Collection, CollectionSlug } from "../types"

export const NFT_COLLECTIONS: Collection[] = [
  {
    address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    symbol: 'BAYC',
    name: 'Bored Ape Yacht Club',
    twitterUsername: 'BoredApeYC',
    slug: CollectionSlug.boredapeyachtclub,
    profitThreshold: 15000
  },
  {
    address: '0x60e4d786628fea6478f785a6d7e704777c86a7c6',
    symbol: 'MAYC',
    name: 'Mutant Ape Yacht Club',
    twitterUsername: 'BoredApeYC',
    slug: CollectionSlug.mutantapeyachtclub,
    profitThreshold: 1000
  },
  {
    address: '0x1a92f7381b9f03921564a437210bb9396471050c',
    symbol: 'COOL',
    name: 'Cool Cats NFT',
    twitterUsername: 'coolcatsnft',
    slug: CollectionSlug.coolcatsnft,
    profitThreshold: 2000
  },
  {
    address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
    symbol: 'PUNK',
    name: 'CryptoPunks',
    twitterUsername: 'larvalabs',
    slug: CollectionSlug.cryptopunks,
    profitThreshold: 25000
  },
];
