# CLAUDE.md

Context for AI coding agents (Claude Code and compatible tools) working in this repo.

## What this is

NFT Sales Bot ("Flip McBot", [@nftsalesbot](https://twitter.com/nftsalesbot)) — a Node + TypeScript worker that polls NFT sales for a curated allowlist of blue-chip collections, reconstructs each flip (buy price, sell price, hold time, P/L in ETH and USD), and posts it to X/Twitter with the NFT's image.

> **Legacy status:** the bot was built on OpenSea's v1 `/api/v1/events` REST API, which OpenSea has retired — the endpoint now returns `410 Gone`. The project builds, lints, and boots, but it **cannot fetch live sales** until it's ported to OpenSea's current API (v2 / Stream API). A "successful" run will still fail at the OpenSea fetch with `Gone` — that's expected, not a regression you introduced.

## Commands

```bash
yarn install      # install deps
yarn dev          # dev/debug mode (nodemon + babel-node) — runs DebugBot once, logs the tweet, does not post
yarn build        # compile src/ -> build/ with Babel
yarn start        # run the compiled production bot (node build/salesbot.js)
yarn lint         # eslint --fix (console statements warn by design)
yarn prettify     # prettier --write
```

If `yarn` aborts with an `engine "node" is incompatible` error on a newer Node, prefix commands with `YARN_IGNORE_ENGINES=true` (the `engines.node` range has been relaxed to `>=18`, but yarn classic enforces it strictly).

## Run modes

`src/core/SalesBot.ts` branches on `IS_PRODUCTION` (`NODE_ENV === 'production'`):

- **dev** (default): runs `runDebugBot()` once against a single hardcoded token (MAYC #18012), composes a tweet, and **logs it instead of posting**.
- **production**: infinite loop — for each allowlisted collection, fetch recent sales, diff against the last seen IDs, reconstruct the flip, download the image, post the tweet, wait `TIMEOUT_SECONDS` (30s), advance.

## Architecture

```
src/
  salesbot.ts        entry: new SalesBot().start()
  api/               thin clients over external APIs
    OpenSeaAPI.ts    sale events  (LEGACY v1 endpoint — returns 410 Gone)
    CoinbaseAPI.ts   historical ETH/USD spot price
    TwitterAPI.ts    post tweet (v2) + upload media (v1) via twitter-api-v2
  core/
    SalesBot.ts      production polling loop + dev branch
    DebugBot.ts      single-sale dev run
    OpenSea.ts       map raw OpenSea events -> Sale
    SaleData.ts      flip math: P/L, %, hold duration, profit flag
    Twitter/         tweet string composition (intro/status/USD/ETH/hodl)
  shared/            Allowlist (tracked collections), Blocklist, Constants
  utils/             Crypto (wallet/price fmt), DateTime, Image, Number, String, API, OpenSea
  types/             shared interfaces (Sale, Collection, SaleData, ...)
```

## Conventions

- TypeScript compiled with **Babel**, not `tsc` — `tsconfig.json` is `noEmit` (editor/types only). Build output goes to `build/`.
- Prettier: **no semicolons**, single quotes, no trailing commas, width 80 (`.prettierrc`).
- ESLint flags `console` as a *warning*; the bot logs intentionally, so these warnings are expected — don't churn the code to silence them.
- A Husky `pre-commit` hook runs `lint-staged` (lint + prettify on staged `.ts`).
- Secrets come **only** from `process.env` (see `.env.example`). Never hardcode keys; `.env` is gitignored.

## Environment variables

Copy `.env.example` → `.env` and fill in:

- `OPENSEA_API_KEY`
- `TWITTER_API_KEY`, `TWITTER_API_SECRET_KEY`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_TOKEN_SECRET`
- `NODE_ENV` — set to `production` to actually post tweets

## Common tasks

- **Add a tracked collection:** append a `Collection` to `ALLOWLISTED_COLLECTIONS` in `src/shared/Allowlist.ts` (address, name, slug, symbol; optional `displaySymbol`, `twitterUsername`).
- **Change tweet wording/format:** edit the small composers in `src/core/Twitter/` and verify with `yarn dev`.
- **Tune flip thresholds / labels:** profit/loss gating is in `src/core/Twitter/index.ts`; status tiers are in `src/core/Twitter/TweetStatus.ts`.

## Deploy

Heroku worker dyno — `Procfile`: `worker: node build/salesbot.js`. Run `yarn build` first.
