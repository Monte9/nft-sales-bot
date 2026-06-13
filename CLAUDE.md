# CLAUDE.md

Context for AI coding agents (Claude Code and compatible tools) working in this repo.

## What this is

NFT Sales Bot ("Flip McBot", [@nftsalesbot](https://twitter.com/nftsalesbot)) — a Node + TypeScript worker that polls NFT sales for a curated allowlist of blue-chip collections, reconstructs each flip (buy price, sell price, hold time, P/L in ETH and USD), and posts it to X/Twitter with the NFT's image.

> **Legacy status:** the bot was built on OpenSea's v1 `/api/v1/events` REST API, which OpenSea has retired — the endpoint now returns `410 Gone`. The project builds, lints, and boots, but it **cannot fetch live sales** until it's ported to OpenSea's current API (v2 / Stream API). A "successful" run will still fail at the OpenSea fetch with `Gone` — that's expected, not a regression you introduced.

## Project status & roadmap

**Repo:** public, MIT-licensed, on GitHub as `Monte9/nft-sales-bot` (renamed from `legacy-nft-sales-bot`).

**Done (June 2026):**
- Security scan for going public — clean (no secrets in the working tree or git history).
- README rewritten; `CLAUDE.md` + `AGENTS.md` added; MIT `LICENSE`.
- Toolchain modernized: Node `>=20` (`.nvmrc` = 22), Yarn pinned via `packageManager`, husky 8 → 9, lint-staged → 15. `yarn lint` and `yarn build` are green.

**Next up → revive the data source.** The OpenSea v1 events API is retired (`410 Gone`), so the bot can't fetch live sales. Port it to OpenSea API v2 — see [Next task](#next-task-port-to-opensea-api-v2).

## Commands

```bash
yarn install      # install deps
yarn dev          # dev/debug mode (nodemon + babel-node) — runs DebugBot once, logs the tweet, does not post
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

## Next task: port to OpenSea API v2

The whole pipeline (flip math, USD conversion, tweet composition, posting) is intact and tested — **only the OpenSea data layer is dead.** Reviving it is the next milestone.

**Why:** `src/api/OpenSeaAPI.ts` calls `https://api.opensea.io/api/v1/events`, which now returns `410 Gone`. Reproduce with `yarn dev` (boots, then fails at the OpenSea fetch with `Gone`).

**What the bot needs from OpenSea (two calls, in `OpenSeaAPI.ts`):**
1. `fetchSaleEventsForCollection(slug)` — recent sales for a collection; drives the polling loop and `getCollectionData()` in `SalesBot.ts`.
2. `fetchSaleEventsForToken(address, tokenId, eventType)` — a single token's history, used to find the **prior purchase** (or the mint, via `eventType='transfer'`) so the flip can be computed.

**Migration plan:**
- Move to **OpenSea API v2** (base `https://api.opensea.io/api/v2`, auth header `X-API-KEY: <OPENSEA_API_KEY>`).
  - Recent collection sales → **Get Events by Collection** (`/api/v2/events/collection/{slug}?event_type=sale`).
  - Per-token history → **Get Events by NFT** (`/api/v2/events/chain/ethereum/contract/{address}/nfts/{identifier}`), querying `sale` and `transfer` to reach the mint (mirrors today's fallback).
  - For real-time instead of 30s polling, consider the **Stream API** (websockets, `item_sold`).
  - ⚠️ Verify exact paths, params, and response shapes against the current docs at https://docs.opensea.io — the v2 schema differs from v1. Don't trust field names from memory.
- Update the parser `src/core/OpenSea.ts` (`parseSales`) to map v2 event JSON → the `Sale` interface. Expect renames (price in wei under a `payment` object; `winner_account`/`seller` → `buyer`/`seller` or `maker`/`taker`; token id as `identifier`).
- Treat the `Sale` / `Asset` / `PaymentToken` interfaces in `src/types/index.ts` as the stable internal contract — adapt the mapping, keep downstream code unchanged where possible.

**How to verify:** put a real `OPENSEA_API_KEY` in `.env` and run `yarn dev` (exercises `DebugBot` → MAYC #18012). Success = a composed tweet logged to the console. Then set `NODE_ENV=production` to exercise the full loop (it will *post*, so use a throwaway Twitter app first).

## Environment notes (Claude Code on the web)

- **The default branch is push-protected by the platform.** A direct `git push` to `main` fails (HTTP 503) even though *classic* branch protection is off (`list_branches` reports `protected: false`). Push to a feature branch and land changes via PR.
- **Commit signing does not work in-session** — the SSH signing key (`~/.ssh/commit_signing_key.pub`) is empty, so commits show as "Unverified" on GitHub. Cosmetic; it does not block merging.
- The managed git remote is authorized for the original repo path and redirects to the renamed repo automatically; don't bother re-pointing it.

## Deploy

Heroku worker dyno — `Procfile`: `worker: node build/salesbot.js`. Run `yarn build` first.
