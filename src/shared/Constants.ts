import { Collection } from "../types"

export enum CollectionSlug {
  artblocks = "art-blocks",
  boredapeyachtclub = "boredapeyachtclub",
  coolcatsnft = "cool-cats-nft",
  cryptopunks = "cryptopunks",
  dystopunksv2 = "dystopunks-v2",
  lazylions = "lazy-lions",
  mutantapeyachtclub = "mutant-ape-yacht-club",
}

export const ACTIVE_NFT_COLLECTIONS: Collection[] = [
  {
    address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    symbol: 'BAYC',
    name: 'Bored Ape Yacht Club',
    twitterUsername: 'BoredApeYC',
    slug: CollectionSlug.boredapeyachtclub,
    profitThreshold: 20000,
    alternateNames: ['BAYC'],
  },
  {
    address: '0x1a92f7381b9f03921564a437210bb9396471050c',
    symbol: 'COOL',
    name: 'Cool Cats NFT',
    twitterUsername: 'coolcatsnft',
    slug: CollectionSlug.coolcatsnft,
    profitThreshold: 5000,
    alternateNames: ['Cool Cats NFTs'],
  },
  {
    address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
    symbol: 'PUNK',
    name: 'CryptoPunks',
    twitterUsername: 'larvalabs',
    slug: CollectionSlug.cryptopunks,
    profitThreshold: 30000,
    alternateNames: ['Crypto Punks'],
  },
  {
    address: '0x059edd72cd353df5106d2b9cc5ab83a52287ac3a',
    symbol: 'BLOCKS',
    name: 'Art Blocks Curated',
    twitterUsername: null,
    slug: CollectionSlug.artblocks,
    profitThreshold: 5000,
    alternateNames: ['Chromie Squiggle', 'Art Blocks Curated Chromie Squiggle'],
  },
  {
    address: '0x8943c7bac1914c9a7aba750bf2b6b09fd21037e0',
    symbol: 'LION',
    name: 'Lazy Lions',
    twitterUsername: 'LazyLionsNFT',
    slug: CollectionSlug.lazylions,
    profitThreshold: 5000,
    alternateNames: ['Lazy Lions'],
  },
];

export const INACTIVE_NFT_COLLECTIONS: Collection[] = [
  {
    address: '0x60e4d786628fea6478f785a6d7e704777c86a7c6',
    symbol: 'MAYC',
    name: 'Mutant Ape Yacht Club',
    twitterUsername: 'BoredApeYC',
    slug: CollectionSlug.mutantapeyachtclub,
    profitThreshold: 3000,
    alternateNames: ['MAYC'],
  },
  {
    address: '0xbea8123277142de42571f1fac045225a1d347977',
    symbol: 'DYSTO',
    name: 'DystoPunks V2',
    twitterUsername: 'DystoPunks',
    slug: CollectionSlug.dystopunksv2,
    profitThreshold: 2000,
    alternateNames: [],
  },
];
