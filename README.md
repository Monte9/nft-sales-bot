## NFT Sales Bot

A Twitter bot reporting crazy flips and annualized returns for all blue-chip NFT projects.

You can find me tweeting @ [Flip McBot](https://twitter.com/nftsalesbot)

### Getting Started

This is a `Node` server with `Typescript`. It polls the OpenSea `/v1/events` endpoint every 30 seconds to get the latest NFT sales for various collections. It then crunches the sale data and uses the `twitter-api-v2` package to post a Tweet.

### Setup

```
git clone git@github.com:Monte9/nft-sales-bot.git

cd nft-sales-bot && yarn

yarn start:dev
```

## Adding ENV Variables

In order to post a tweet, you will need access to the Twitter Developer account. Without valid API keys you'll get the following error when running the app

`Oops! Unable to post the Tweet: Invalid or expired token.`

To get Twitter API keys you need to submit a new application at https://developer.twitter.com/en/apps. It typically takes them 1-2 days to get back to you.

Once you have the Twitter API keys, create a new file called `.env`. Then copy the contents over from the `.env.example` file and replace all the `TODO_REPLACE_THIS` instances with the appropriate values.

### Release

This app is deployed on Heroku and is run on a paid worker. It uses `Babel` to transform the `Typescript` code to `Javascript` before deploying it.

Here is how to build this manually

```
yarn build

yarn start
```

Lastly, don't forget to upload your Twitter API keys to Heroku or your CI/CD platform.
