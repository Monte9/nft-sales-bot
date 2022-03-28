import { Collection } from '../types'

// All the supported collection slugs
export enum CollectionSlug {
  alienfrensnft = 'alienfrensnft',
  anonymice = 'anonymice',
  autoglyphs = 'autoglyphs',
  archetypebykjetilgolid = 'archetype-by-kjetil-golid',
  azuki = 'azuki',
  chromiesquigglebysnowfro = 'chromie-squiggle-by-snowfro',
  boredapechemistryclub = 'bored-ape-chemistry-club',
  boredapekennelclub = 'bored-ape-kennel-club',
  boredapeyachtclub = 'boredapeyachtclub',
  clonex = 'clonex',
  coolcatsnft = 'cool-cats-nft',
  creatures = 'creature-world-collection',
  cryptopunks = 'cryptopunks',
  cryptoadz = 'cryptoadz-by-gremplin',
  cyberkongz = 'cyberkongz',
  deadfellaz = 'deadfellaz',
  doodlesofficial = 'doodles-official',
  dystopunks = 'dystopunks',
  fidenzabytylerhobbs = 'fidenza-by-tyler-hobbs',
  guttercatgang = 'guttercatgang',
  lazylions = 'lazy-lions',
  meebits = 'meebits',
  mekaverse = 'mekaverse',
  mfers = 'mfers',
  mutantapeyachtclub = 'mutant-ape-yacht-club',
  pudgypenguins = 'pudgypenguins',
  ringersbydmitricherniak = 'ringers-by-dmitri-cherniak',
  sneakyvampiresyndicate = 'sneaky-vampire-syndicate',
  supducks = 'supducks',
  timepiececommunity = 'timepiece-community',
  veefriends = 'veefriends',
  wolfgame = 'wolf-game',
  worldofwomennft = 'world-of-women-nft'
}

export const ART_BLOCKS_CURATED_COLLECTIONS: Collection[] = [
  {
    address: '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270',
    name: 'Ringers by Dmitri Cherniak',
    slug: CollectionSlug.ringersbydmitricherniak,
    symbol: 'BLOCKS',
    displaySymbol: 'RINGERS',
    twitterUsername: null
  },
  {
    address: '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270',
    name: 'Fidenza by Tyler Hobbs',
    slug: CollectionSlug.fidenzabytylerhobbs,
    symbol: 'BLOCKS',
    displaySymbol: 'FIDENZA',
    twitterUsername: null
  },
  {
    address: '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270',
    name: 'Archetype by Kjetil Golid',
    slug: CollectionSlug.archetypebykjetilgolid,
    symbol: 'BLOCKS',
    displaySymbol: 'ARCHETYPE',
    twitterUsername: null
  },
  {
    address: '0x059edd72cd353df5106d2b9cc5ab83a52287ac3a',
    name: 'Chromie Squiggle by Snowfro',
    slug: CollectionSlug.chromiesquigglebysnowfro,
    symbol: 'BLOCKS',
    displaySymbol: 'CHROMIE SQUIGGLE',
    twitterUsername: null
  }
]

export const ACTIVE_NFT_COLLECTIONS: Collection[] = [
  ...ART_BLOCKS_CURATED_COLLECTIONS,
  {
    address: '0xd4e4078ca3495de5b1d4db434bebc5a986197782',
    name: 'Autoglyphs',
    slug: CollectionSlug.autoglyphs,
    symbol: 'AUTOGLYPHS',
    twitterUsername: null
  },
  {
    address: '0xed5af388653567af2f388e6224dc7c4b3241c544',
    name: 'Azuki',
    slug: CollectionSlug.azuki,
    symbol: 'AZUKI',
    twitterUsername: null
  },
  {
    address: '0x22c36bfdcef207f9c0cc941936eff94d4246d14a',
    name: 'Bored Ape Chemistry Club',
    slug: CollectionSlug.boredapechemistryclub,
    symbol: 'SERUM',
    twitterUsername: 'BoredApeYC'
  },
  {
    address: '0xba30e5f9bb24caa003e9f2f0497ad287fdf95623',
    name: 'Bored Ape Kennel Club',
    slug: CollectionSlug.boredapekennelclub,
    symbol: 'BAKC',
    twitterUsername: 'BoredApeYC'
  },
  {
    address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    name: 'Bored Ape Yacht Club',
    slug: CollectionSlug.boredapeyachtclub,
    symbol: 'BAYC',
    twitterUsername: 'BoredApeYC'
  },
  {
    address: '0x1a92f7381b9f03921564a437210bb9396471050c',
    name: 'Cool Cats NFT',
    slug: CollectionSlug.coolcatsnft,
    symbol: 'COOL',
    displaySymbol: 'COOL CAT',
    twitterUsername: 'coolcatsnft'
  },
  {
    address: '0x1cb1a5e65610aeff2551a50f76a87a7d3fb649c6',
    name: 'CrypToadz by GREMPLIN',
    slug: CollectionSlug.cryptoadz,
    symbol: 'TOADZ',
    displaySymbol: 'CRYPTOADZ',
    twitterUsername: 'cryptoadzNFT'
  },
  {
    address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
    name: 'CryptoPunks',
    slug: CollectionSlug.cryptopunks,
    symbol: 'PUNK',
    displaySymbol: 'CRYPTOPUNK',
    twitterUsername: 'BoredApeYC'
  },
  {
    address: '0x57a204aa1042f6e66dd7730813f4024114d74f37',
    name: 'CyberKongz',
    slug: CollectionSlug.cyberkongz,
    symbol: 'KONGZ',
    displaySymbol: 'CYBERKONG',
    twitterUsername: 'CyberKongz'
  },
  {
    address: '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b',
    name: 'CLONE X - X TAKASHI MURAKAMI',
    slug: CollectionSlug.clonex,
    symbol: 'CloneX',
    displaySymbol: 'CLONEX',
    twitterUsername: 'RTFKTstudios'
  },
  {
    address: '0x2acab3dea77832c09420663b0e1cb386031ba17b',
    name: 'DeadFellaz',
    slug: CollectionSlug.deadfellaz,
    symbol: 'DEADFELLAZ',
    displaySymbol: 'DEADFELLAZ',
    twitterUsername: 'deadfellaznft'
  },
  {
    address: '0xedb61f74b0d09b2558f1eeb79b247c1f363ae452',
    name: 'Gutter Cat Gang',
    slug: CollectionSlug.guttercatgang,
    symbol: 'GANG',
    displaySymbol: 'GUTTER CAT',
    twitterUsername: 'guttercatgang'
  },
  {
    address: '0x60e4d786628fea6478f785a6d7e704777c86a7c6',
    name: 'Mutant Ape Yacht Club',
    slug: CollectionSlug.mutantapeyachtclub,
    symbol: 'MAYC',
    twitterUsername: 'BoredApeYC'
  },
  {
    address: '0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7',
    name: 'Meebits',
    slug: CollectionSlug.meebits,
    symbol: 'MEEBITS',
    displaySymbol: 'MEEBIT',
    twitterUsername: 'BoredApeYC'
  },
  {
    address: '0x79fcdef22feed20eddacbb2587640e45491b757f',
    name: 'mfers',
    slug: CollectionSlug.mfers,
    symbol: 'MFER',
    twitterUsername: 'sartoshi_nft'
  },
  {
    address: '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e',
    name: 'Doodles',
    slug: CollectionSlug.doodlesofficial,
    symbol: 'DOODLE',
    twitterUsername: 'doodles'
  },
  {
    address: '0xa3aee8bce55beea1951ef834b99f3ac60d1abeeb',
    name: 'VeeFriends',
    slug: CollectionSlug.veefriends,
    symbol: 'VFT',
    displaySymbol: 'VEEFRIENDS',
    twitterUsername: 'veefriends'
  },
  {
    address: '0xe785e82358879f061bc3dcac6f0444462d4b5330',
    name: 'World of Women',
    slug: CollectionSlug.worldofwomennft,
    symbol: 'WOW',
    twitterUsername: 'worldofwomennft'
  }
]

export const INACTIVE_NFT_COLLECTIONS: Collection[] = [
  {
    address: '0xbad6186e92002e312078b5a1dafd5ddf63d3f731',
    name: 'Anonymice',
    slug: CollectionSlug.anonymice,
    symbol: 'MICE',
    displaySymbol: 'ANONYMICE',
    twitterUsername: 'AnonymiceNFT'
  },
  {
    address: '0x123b30e25973fecd8354dd5f41cc45a3065ef88c',
    name: 'alien frens',
    slug: CollectionSlug.alienfrensnft,
    symbol: 'ALIENFRENS',
    twitterUsername: 'alienfrens'
  },
  {
    address: '0xc92ceddfb8dd984a89fb494c376f9a48b999aafc',
    name: 'Creature World NFT',
    slug: CollectionSlug.creatures,
    symbol: 'CREATURE',
    twitterUsername: 'creaturenft'
  },
  {
    address: '0xbea8123277142de42571f1fac045225a1d347977',
    name: 'DystoPunks',
    slug: CollectionSlug.dystopunks,
    symbol: 'DYSTO',
    displaySymbol: 'DYSTOPUNK',
    twitterUsername: 'DystoPunks'
  },
  {
    address: '0x8943c7bac1914c9a7aba750bf2b6b09fd21037e0',
    name: 'Lazy Lions',
    slug: CollectionSlug.lazylions,
    symbol: 'LION',
    twitterUsername: 'LazyLionsNFT'
  },
  {
    address: '0x9a534628b4062e123ce7ee2222ec20b86e16ca8f',
    name: 'MekaVerse',
    slug: CollectionSlug.mekaverse,
    symbol: 'MEKA',
    twitterUsername: 'MekaVerse'
  },
  {
    address: '0xbd3531da5cf5857e7cfaa92426877b022e612cf8',
    name: 'Pudgy Penguins',
    slug: CollectionSlug.pudgypenguins,
    symbol: 'PPG',
    twitterUsername: 'pudgy_penguins'
  },
  {
    address: '0x219b8ab790decc32444a6600971c7c3718252539',
    name: 'Sneaky Vampire Syndicate',
    slug: CollectionSlug.sneakyvampiresyndicate,
    symbol: 'SVS',
    twitterUsername: 'svsnft'
  },
  {
    address: '0x3fe1a4c1481c8351e91b64d5c398b159de07cbc5',
    name: 'Sup Ducks',
    slug: CollectionSlug.supducks,
    symbol: 'SD',
    twitterUsername: 'realsupducks'
  },
  {
    address: '0xdd69da9a83cedc730bc4d3c56e96d29acc05ecde',
    name: 'TIMEPiece Community',
    slug: CollectionSlug.timepiececommunity,
    symbol: 'BABF',
    twitterUsername: 'time'
  },
  {
    address: '0xeb834ae72b30866af20a6ce5440fa598bfad3a42',
    name: 'Wolf Game Wolves',
    slug: CollectionSlug.wolfgame,
    symbol: 'WGAME',
    displaySymbol: 'WOLF',
    twitterUsername: 'wolfdotgame'
  }
]
