import { Collection } from "../types"

export enum CollectionSlug {
  artblocks = "art-blocks",
  boredapeyachtclub = "boredapeyachtclub",
  coolcatsnft = "cool-cats-nft",
  cryptopunks = "cryptopunks",
  cryptoadz = "cryptoadz-by-gremplin",
  cyberkongz = "cyberkongz",
  dystopunksv2 = "dystopunks-v2",
  lazylions = "lazy-lions",
  mutantapeyachtclub = "mutant-ape-yacht-club",
  supducks = "supducks",
  timepiececommunity = "timepiece-community",
  sneakyvampiresyndicate = "sneaky-vampire-syndicate"
}

export const ACTIVE_NFT_COLLECTIONS: Collection[] = [
  {
    address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    name: 'Bored Ape Yacht Club',
    slug: CollectionSlug.boredapeyachtclub,
    symbol: 'BAYC',
    twitterUsername: 'BoredApeYC',
    alternateNames: ['BAYC'],
  },
  {
    address: '0x1a92f7381b9f03921564a437210bb9396471050c',
    name: 'Cool Cats NFT',
    slug: CollectionSlug.coolcatsnft,
    symbol: 'COOL',
    twitterUsername: 'coolcatsnft',
    alternateNames: ['Cool Cats NFTs'],
  },
  {
    address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
    name: 'CryptoPunks',
    slug: CollectionSlug.cryptopunks,
    symbol: 'PUNK',
    twitterUsername: 'larvalabs',
    alternateNames: ['Crypto Punks'],
  },
  {
    address: '0x059edd72cd353df5106d2b9cc5ab83a52287ac3a',
    name: 'Art Blocks Curated',
    slug: CollectionSlug.artblocks,
    symbol: 'BLOCKS',
    twitterUsername: null,
    alternateNames: ['Chromie Squiggle', 'Art Blocks Curated Chromie Squiggle'],
  },
  {
    address: '0x8943c7bac1914c9a7aba750bf2b6b09fd21037e0',
    name: 'Lazy Lions',
    slug: CollectionSlug.lazylions,
    symbol: 'LION',
    twitterUsername: 'LazyLionsNFT',
    alternateNames: ['Lazy Lions'],
  },
  {
    address: '0x3fe1a4c1481c8351e91b64d5c398b159de07cbc5',
    name: 'SupDucks',
    slug: CollectionSlug.supducks,
    symbol: 'SD',
    twitterUsername: 'realsupducks',
    alternateNames: ['Sup Ducks'],
  },
  {
    address: '0x57a204aa1042f6e66dd7730813f4024114d74f37',
    name: 'CyberKongz',
    slug: CollectionSlug.cyberkongz,
    symbol: 'KONGZ',
    twitterUsername: 'CyberKongz',
    alternateNames: ['CyberKongz'],
  },
  {
    address: '0xdd69da9a83cedc730bc4d3c56e96d29acc05ecde',
    name: 'TIMEPiece Community',
    slug: CollectionSlug.timepiececommunity,
    symbol: 'BABF',
    twitterUsername: 'time',
    alternateNames: [],
  },
  {
    address: '0x219b8ab790decc32444a6600971c7c3718252539',
    name: 'Sneaky Vampire Syndicate',
    slug: CollectionSlug.sneakyvampiresyndicate,
    symbol: 'SVS',
    twitterUsername: 'svsnft',
    alternateNames: [],
  },
  {
    address: '0x1cb1a5e65610aeff2551a50f76a87a7d3fb649c6',
    name: 'Cryptoadz',
    slug: CollectionSlug.cryptoadz,
    symbol: 'TOADZ',
    twitterUsername: 'cryptoadzNFT',
    alternateNames: ['CrypToadz by GREMPLIN'],
  },
];

export const INACTIVE_NFT_COLLECTIONS: Collection[] = [
  {
    address: '0x60e4d786628fea6478f785a6d7e704777c86a7c6',
    name: 'Mutant Ape Yacht Club',
    slug: CollectionSlug.mutantapeyachtclub,
    symbol: 'MAYC',
    twitterUsername: 'BoredApeYC',
    alternateNames: ['MAYC'],
  },
  {
    address: '0xbea8123277142de42571f1fac045225a1d347977',
    name: 'DystoPunks V2',
    slug: CollectionSlug.dystopunksv2,
    symbol: 'DYSTO',
    twitterUsername: 'DystoPunks',
    alternateNames: [],
  },
];
