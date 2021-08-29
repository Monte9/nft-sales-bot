import { Collection } from "../types/OpenSeaSale"

export enum CollectionSymbol {
  BAYC,
  MAYC,
  COOL,
  PUNK,
  MEEB
}

export enum CollectionSlug {
  animetas = "animetas",
  boredapekennelclub = "bored-ape-kennel-club",
  boredapeyachtclub = "boredapeyachtclub",
  mutantapeyachtclub = "mutantapeyachtclub",
  coolcatsnft = "cool-cats-nft",
  cryptopunks = "cryptopunks",
  meebits = "meebits",
  on1force = "0n1-force",
  guttercatgang = "guttercatgang",
}

export const NFT_COLLECTIONS: Collection[] = [
  {
    address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    symbol: CollectionSymbol.BAYC,
    name: 'Bored Ape Yacht Club',
    twitterUsername: 'BoredApeYC',
    slug: CollectionSlug.boredapeyachtclub,
    profitThreshold: 15000
  },
  {
    address: '0x60e4d786628fea6478f785a6d7e704777c86a7c6',
    symbol: CollectionSymbol.BAYC,
    name: 'Mutant Ape Yacht Club',
    twitterUsername: 'BoredApeYC',
    slug: CollectionSlug.mutantapeyachtclub,
    profitThreshold: 1000
  },
  {
    address: '0x1a92f7381b9f03921564a437210bb9396471050c',
    symbol: CollectionSymbol.COOL,
    name: 'Cool Cats NFT',
    twitterUsername: 'coolcatsnft',
    slug: CollectionSlug.coolcatsnft,
    profitThreshold: 2000
  },
  {
    address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
    symbol: CollectionSymbol.PUNK,
    name: 'CryptoPunks',
    twitterUsername: 'larvalabs',
    slug: CollectionSlug.cryptopunks,
    profitThreshold: 25000
  },
  {
    address: '0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7',
    symbol: CollectionSymbol.MEEB,
    name: 'Meebits',
    twitterUsername: 'larvalabs',
    slug: CollectionSlug.meebits,
    profitThreshold: 5000
  }
];
