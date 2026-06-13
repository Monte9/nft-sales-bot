# CLAUDE.md

Context for AI coding agents (Claude Code and compatible tools) working in this repo.

## What this is

NFT Sales Bot ("Flip McBot", [@nftsalesbot](https://twitter.com/nftsalesbot)) — a Node + TypeScript worker that polls NFT sales for a curated allowlist of blue-chip collections, reconstructs each flip (buy price, sell price, hold time, P/L in ETH and USD), and posts it to X/Twitter with the NFT's image.

> **Heads up:** this is an older bot — some of the third-party APIs it calls may have changed since it last ran in production. The fastest way to see where it actually stands today is to run it locally (below) and watch the output; a failure coming from an upstream API isn't necessarily something you broke.

## Running it locally & testing

```bash
nvm use                 # Node 20+ (.nvmrc pins 22); any Node >= 20 works
yarn install
cp .env.example .env     # then add OPENSEA_API_KEY + the four TWITTER_* keys
yarn dev                 # debug mode: runs once against one sale and logs the tweet (never posts)
```

`yarn dev` exercises `DebugBot` — a single hardcoded sale (MAYC #18012) — so watch the console to see how the bot behaves end-to-end today. `yarn lint` and `yarn build` should both pass. To run the full polling loop instead of the one-shot debug, set `NODE_ENV=production` (⚠️ production mode actually posts tweets — use a throwaway Twitter app).

## Commands

```bash
yarn install      # install deps
yarn dev          # dev/debug mode (nodemon + babel-node) — runs DebugBot once, logs the tweet
yarn build        # compile src/ -> build/ with Babel
yarn start        # run the compiled production bot (node build/salesbot.js)
yarn lint         # eslint --fix (console statements warn by design)
yarn prettify     # prettier --write
```

The repo targets **Node 20+** (pinned via `.nvmrc` = 22) and **Yarn 1.x** (pinned via the `packageManager` field for Corepack). If `yarn` aborts with an `engine "node" is incompatible` error on an older Node, prefix commands with `YARN_IGNORE_ENGINES=true`.

## Run modes

`src/core/SalesBot.ts` branches on `IS_PRODUCTION` (`NODE_ENV === 'production'`):

- **dev** (default): runs `runDebugBot()` once against a single hardcoded token (MAYC #18012), composes a tweet, and **logs it instead of posting**.
- **production**: infinite loop — for each allowlisted collection, fetch recent sales, diff against the last seen IDs, reconstruct the flip, download the image, post the tweet, wait `TIMEOUT_SECONDS` (30s), advance.

## Architecture

```
src/
  salesbot.ts        entry: new SalesBot().start()
  api/               thin clients over external APIs
    OpenSeaAPI.ts    sale events (recent-by-collection + per-token history)
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

## Environment notes (Claude Code on the web)

- **The default branch is push-protected by the platform.** A direct `git push` to `main` fails (HTTP 503) even though *classic* branch protection is off (`list_branches` reports `protected: false`). Push to a feature branch and land changes via PR.
- **Commit signing does not work in-session** — the SSH signing key (`~/.ssh/commit_signing_key.pub`) is empty, so commits show as "Unverified" on GitHub. Cosmetic; it does not block merging.
- The managed git remote is authorized for the original repo path and redirects to the renamed repo automatically; don't bother re-pointing it.

## Deploy

Heroku worker dyno — `Procfile`: `worker: node build/salesbot.js`. Run `yarn build` first.
