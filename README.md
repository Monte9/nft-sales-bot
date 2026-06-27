# NFT Sales Bot

**Single-tweet stories of NFT flips & fumbles.** A Twitter/X bot that turns every blue-chip NFT sale into a story — what the seller paid, what they sold for, how long they held, and the profit or loss in ETH and USD — posted as one glanceable tweet with the art attached.

[**@nftsalesbot**](https://twitter.com/nftsalesbot) — "Flip McBot" on X — **25k+ followers**, created by [@dearearth_](https://twitter.com/dearearth_).

![Status](https://img.shields.io/badge/status-legacy-orange) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE) ![Node](https://img.shields.io/badge/node-%E2%89%A520-339933?logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-4.3-3178C6?logo=typescript&logoColor=white) [![X: @nftsalesbot](https://img.shields.io/badge/X-%40nftsalesbot-000000?logo=x&logoColor=white)](https://twitter.com/nftsalesbot) [![Followers](https://img.shields.io/badge/followers-25k%2B-000000?logo=x&logoColor=white)](https://twitter.com/nftsalesbot)

> [!NOTE]
> **This is the _legacy_ bot.** It was built on OpenSea's v1 `/api/v1/events` REST API, which OpenSea has since retired — the endpoint now returns `410 Gone`. The project still builds, lints, and boots cleanly, but it can't fetch live sales until it's ported to the current OpenSea API (v2 / Stream API). See [Status](#status).

A tweet looks like this (illustrative):

```
👀 0x1a2b..9f3c ↗️ flipped ↗️ BAYC #8817
https://opensea.io/assets/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/8817

🏆 status: Bruhhh
💸 paid: $12,400 (Aug 28, 2021)
🤑 made: +$284,000 (+2,290%)
🛒 3.5 WETH ➡️ 42 WETH
⏳ 8 months
```

…and not every flip has a happy ending — a real @nftsalesbot post that went viral:

```
👀 0x4881..03a8 ↘️ fumbled ↘️ CRYPTOADZ #2155
https://opensea.io/assets/ethereum/0x1cb1a5e65610aeff2551a50f76a87a7d3fb649c6/2155

🏆 status: Diamond Hands
🛒 in: 300 WETH
💰 out: 6.9 WETH
😬 hodl: 8 months 6 days

Ξ loss: -293.1 ETH ❌

💲 spent: $1,016,100 (10/2021)
💲 lost: -$1,006,212 (📉 -99%)
```

> A real post — Jun 13, 2022 · 1,448 likes · 311 retweets · 322 quotes. The deadpan **"Diamond Hands"** label on a -99% loss is the bot's signature sarcasm.

## Why NFT Sales Bot?

During the 2021–2022 NFT boom, the raw sale price was never the interesting part — the **flip** was. Someone minted a Bored Ape for 0.08 ETH and, eight months later, let it go for 80. A floor price can't tell you that; only the round trip can.

NFT Sales Bot watches a curated set of blue-chip collections and, for every sale, reconstructs the whole trade: it finds the seller's original purchase, computes hold time and profit/loss in both ETH and USD, slaps a tongue-in-cheek "status" on it (Diamond Hands → Paper Hands), and posts the result as a single tweet with the NFT's image.

## Quick Start

> Requires **Node 20+** (`.nvmrc` pins 22) and **Yarn 1.x** (pinned via `packageManager`).

```bash
git clone https://github.com/Monte9/nft-sales-bot.git
cd nft-sales-bot
yarn
yarn dev
```

`yarn dev` runs the bot in **debug mode** against a single hardcoded sale and prints the composed tweet instead of posting it — handy for working on the output format without API keys posting to a live account. To fetch real data and post tweets you'll need API keys (see [Environment variables](#environment-variables)). Note: live fetches currently fail with `Gone` because the upstream OpenSea v1 API is retired.

## Features

- **Full flip reconstruction.** For each sale it pulls the prior purchase (or the mint) and computes hold duration, ETH P/L, and USD P/L using the historical ETH price on each date (via Coinbase).
- **Glanceable tweets.** Seller, collection, token id, OpenSea link, USD paid, USD/percentage gain, ETH in→out, and hold time — all in one post, with the NFT image uploaded as media.
- **Status labels.** A profit/loss tier system from `Diamond Hands` and `Bruhhhhhh` down to `Paper Hands` and `Noob`, including a `Tax Loss Harvesting` case for ETH-up-but-dollars-down.
- **Curated allowlist.** ~25 blue-chip collections (BAYC, CryptoPunks, Azuki, Doodles, CloneX, Moonbirds, Art Blocks, and more) in [`src/shared/Allowlist.ts`](src/shared/Allowlist.ts) — plus a blocklist for noise.
- **Signal over noise.** Skips flips under a 1 ETH profit/loss threshold and ignores the 0.08 ETH placeholder OpenSea reports for some Punk contract interactions.
- **Two run modes.** A one-shot debug run for local development, and a production polling loop for deployment.

## Supported Collections

Tracked collections live in [`src/shared/Allowlist.ts`](src/shared/Allowlist.ts). Today that includes:

| | | |
|---|---|---|
| Bored Ape Yacht Club | Mutant Ape Yacht Club | Bored Ape Kennel Club |
| CryptoPunks | Meebits | Autoglyphs |
| Azuki | Doodles | Cool Cats |
| CLONE X | Pudgy Penguins | World of Women |
| Moonbirds | Moonbirds Oddities | VeeFriends |
| Gutter Cat Gang | CyberKongz (Genesis & Babies) | Otherdeed for Otherside |
| DigiDaigaku Genesis | XCOPY | Art Blocks (Fidenza, Ringers, Archetype, Chromie Squiggle) |

Add one by appending a `Collection` entry (address, slug, symbol) to the allowlist.

## Architecture

- **Node + TypeScript, compiled with Babel.** `tsconfig.json` is type-check only (`noEmit`); `yarn build` transpiles `src/` → `build/` via Babel.
- **OpenSea v1 events** ([`api/OpenSeaAPI.ts`](src/api/OpenSeaAPI.ts)) is the data source — recent sales per collection, and the per-token sale/mint history used to find the prior purchase. _(This is the retired endpoint.)_
- **Coinbase spot price** ([`api/CoinbaseAPI.ts`](src/api/CoinbaseAPI.ts)) converts ETH↔USD at the historical date of each buy/sell.
- **Flip math** ([`core/SaleData.ts`](src/core/SaleData.ts)) turns two `Sale`s into a `SaleData` (P/L, %, hold days, profit flag).
- **Tweet composition** ([`core/Twitter/`](src/core/Twitter)) builds the post from small pure functions (intro, status, USD lines, ETH line, hodl).
- **twitter-api-v2** ([`api/TwitterAPI.ts`](src/api/TwitterAPI.ts)) uploads the image (v1 media) and posts the tweet (v2) — only when `NODE_ENV=production`.
- **Deploy:** a Heroku worker dyno (`Procfile`: `worker: node build/salesbot.js`).

## How it works

The production loop in [`core/SalesBot.ts`](src/core/SalesBot.ts) cycles through the allowlist, one collection per tick:

1. Fetch recent sale events for the collection from OpenSea.
2. Diff against the IDs seen last tick to find genuinely new sales.
3. For each new sale, fetch that token's history to get the prior purchase (falling back to the mint transfer if it's a first sale).
4. Compute the flip, download the NFT image, upload it to Twitter, and post the tweet.
5. Wait `TIMEOUT_SECONDS` (30s) and advance to the next collection.

In debug mode ([`core/DebugBot.ts`](src/core/DebugBot.ts)) it does this once for a single hardcoded token and logs the tweet instead of posting.

## Development

```
src/
  salesbot.ts        entry point — new SalesBot().start()
  api/               external API clients (OpenSea, Coinbase, Twitter)
  core/
    SalesBot.ts      production polling loop + dev branch
    DebugBot.ts      single-sale debug run
    OpenSea.ts       map raw OpenSea events → Sale
    SaleData.ts      flip math (P/L, %, hold time)
    Twitter/         tweet string composition
  shared/            Allowlist, Blocklist, Constants
  utils/             Crypto, DateTime, Image, Number, String, API, OpenSea
  types/             shared TypeScript interfaces
CLAUDE.md            context for AI coding agents
.env.example         required environment variables
```

```bash
yarn dev        # nodemon + babel-node, runs the debug bot
yarn build      # compile to build/
yarn start      # run the compiled production bot
yarn lint       # eslint --fix
yarn prettify   # prettier --write
```

Style is enforced by ESLint + Prettier (no semicolons, single quotes, width 80) via a Husky `pre-commit` hook running `lint-staged`.

### Environment variables

Copy `.env.example` to `.env` and fill in your keys:

| Variable | Purpose |
|---|---|
| `OPENSEA_API_KEY` | OpenSea API access |
| `TWITTER_API_KEY` / `TWITTER_API_SECRET_KEY` | Twitter app credentials |
| `TWITTER_ACCESS_TOKEN` / `TWITTER_ACCESS_TOKEN_SECRET` | Twitter account tokens |
| `NODE_ENV` | set to `production` to actually post tweets |

`.env` is gitignored — never commit real keys. Twitter API access requires a [developer account](https://developer.twitter.com/en/apps).

## Status

This repo is preserved as a **legacy** project. The bot's logic is intact and runnable, but its data source — OpenSea's v1 `/api/v1/events` API — has been shut down (`410 Gone`). Reviving it means porting [`api/OpenSeaAPI.ts`](src/api/OpenSeaAPI.ts) and [`core/OpenSea.ts`](src/core/OpenSea.ts) to OpenSea's current v2 / Stream API; the rest of the pipeline (flip math, tweet composition, posting) should carry over largely unchanged.

## Credits

- [@dearearth_](https://twitter.com/dearearth_): creator of [@nftsalesbot](https://twitter.com/nftsalesbot) (25k+ followers)
- [Monte Thakkar](https://github.com/Monte9): creator and maintainer of this codebase

## License

[MIT](LICENSE) © Monte Thakkar
