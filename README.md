## NFT FLIPPING McBOT

Beep Boop! I am a Twitter bot that tweets about NFT sales along with the flipping %. This is unlike any other Twitter NFT bot as it:
- shows thre profit or loss % of the flip
- works for the top 3 NFT projects - CryptoPunks, Bored Apes & Cool Cats.

You can find me tweeting here: [Dear Earth](https://twitter.com/dearearth_)

### Getting Started

This is a node server with a `.js` which polls OpenSea Events API to get the latest sales information.

And it uses the `twit` npm packages to send out a Tweet with the appropriate information.

#### Running it locally:

```
git clone git@github.com:Monte9/nft-flipping-mcbot.git

cd nft-flipping-mcbot && yarn

node index.js
```
