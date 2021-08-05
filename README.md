## NFT Sales Bot

Beep Boop! I am a Twitter bot that tweets all NFT sales along with the profit/loss flip % for CryptoPunks, Bored Apes & Cool Cats.

You can find me tweeting @ [Flip McBot](https://twitter.com/nftsalesbot)

### Getting Started

This is a Node server with Typescript. It uses the `twit` npm package to post a Tweet with the appropriate information.

We currently poll the `OpenSea` API every minute to get latest sales for Bored Apes, Cool Cats & CryptoPunks.

#### Running it locally:

```
git clone git@github.com:Monte9/nft-sales-bot.git

cd nft-sales-bot && yarn

yarn start:dev
```

## Adding ENV Variables

In order to post a tweet, you will need access to the Twitter API keys. Submit a new application at https://developer.twitter.com/en/apps

Then create a new file at the root `.env` and add the API keys in it.

```
TWITTER_API_KEY=
TWITTER_API_SECRET_KEY=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=
```

### Release

This app is deployed on Heroku and is run on a paid worker. It uses babel to transform the `TS` code to `JS` before deploying it.

Here is how to build this manually

```
yarn build

yarn start
```

Don't forget to upload your Twitter API keys to Heroku.
