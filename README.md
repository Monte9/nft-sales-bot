## NFT FLIPPING McBOT

Beep Boop! I am a Twitter bot that tweets all NFT sales along with the profit/loss flip % for CryptoPunks, Bored Apes & Cool Cats.

You can find me tweeting here: [Dear Earth](https://twitter.com/dearearth_)

### Getting Started

This is a Node server with Typescript. It uses the `twit` npm package to post a Tweet with the appropriate information.

We currently poll the `OpenSea` API every minute to get latest sales for Bored Apes, Cool Cats & CryptoPunks.

#### Running it locally:

```
git clone git@github.com:Monte9/nft-flipping-mcbot.git

cd nft-flipping-mcbot && yarn

yarn start:dev
```

### Release

This app is deployed on Heroku and is run on a paid worker. It uses babel to transform the `TS` code to `JS` before deploying it.

Here is how to build this manually

```
yarn build

yarn start
```
