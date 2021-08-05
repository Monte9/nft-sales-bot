import { Collection } from "../types/OpenSeaSale"

export enum CollectionSymbol {
  BAYC,
  COOL,
  PUNK,
  MEEB
}

export const NFT_COLLECTIONS: Collection[] = [
  {
    address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    symbol: CollectionSymbol.BAYC,
    name: 'Bored Ape Yacht Club',
    twitterUsername: 'BoredApeYC',
    slug: 'boredapeyachtclub',
    profitThreshold: 15000
  },
  {
    address: '0x1a92f7381b9f03921564a437210bb9396471050c',
    symbol: CollectionSymbol.COOL,
    name: 'Cool Cats NFT',
    twitterUsername: 'coolcatsnft',
    slug: 'cool-cats-nft',
    profitThreshold: 1000
  },
  {
    address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
    symbol: CollectionSymbol.PUNK,
    name: 'CryptoPunks',
    twitterUsername: 'larvalabs',
    slug: 'cryptopunks',
    profitThreshold: 50000
  },
  {
    address: '0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7',
    symbol: CollectionSymbol.MEEB,
    name: 'Meebits',
    twitterUsername: 'larvalabs',
    slug: 'meebits',
    profitThreshold: 10000
  }
];
