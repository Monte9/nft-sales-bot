# AGENTS.md

This repository uses **[`CLAUDE.md`](CLAUDE.md)** as the canonical guide for AI coding agents — read it first. It covers what the project is, setup and commands, architecture, conventions, current status, and the next task (porting the OpenSea integration to API v2).

## 30-second setup

```bash
nvm use                # Node 20+ (.nvmrc pins 22); or use any Node >= 20
yarn install
cp .env.example .env    # then add OPENSEA_API_KEY + the four TWITTER_* keys
yarn dev                # runs the debug bot; logs a composed tweet (does not post)
```

`yarn lint` and `yarn build` should both pass.

## Current state & next milestone

The bot builds, lints, and boots, but its data source — OpenSea's **v1** events API — is retired (`410 Gone`), so it can't fetch live sales.

**Next task: port `src/api/OpenSeaAPI.ts` + `src/core/OpenSea.ts` to OpenSea API v2.** Full brief in [`CLAUDE.md`](CLAUDE.md#next-task-port-to-opensea-api-v2).

## Gotchas for agents

- Direct pushes to `main` are blocked by the hosting platform — work on a feature branch and open a PR.
- In-session commit signing is unavailable, so commits land "Unverified" (cosmetic).
- TypeScript is compiled with **Babel**, not `tsc`; `console` lint warnings are expected.
