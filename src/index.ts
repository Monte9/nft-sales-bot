import 'dotenv/config';

import OpenSeaAPI from './api/OpenSeaAPI';
import TwitterAPI from './api/TwitterAPI';

import { Sale } from './types/OpenSeaSale';
import { composeTweet } from './utils/Twitter';
import { OPENSEA_CONTRACTS } from './shared/Constants';
import { delayBy } from './utils/Helpers';

class TwitterMcBot {
  twitterAPI: TwitterAPI = null
  openSeaAPI: OpenSeaAPI = null
  range: number = 20

  constructor() {
    this.twitterAPI = new TwitterAPI(
      process.env.TWITTER_CONSUMER_KEY,
      process.env.TWITTER_CONSUMER_SECRET,
      process.env.TWITTER_ACCESS_TOKEN,
      process.env.TWITTER_ACCESS_TOKEN_SECRET,
    )

    this.openSeaAPI = new OpenSeaAPI(OPENSEA_CONTRACTS[0]);
  }

  async runInstance() {
    console.log("Started NFT Flipping McBot")

    let oldSales: [Sale] = null;
    let oldSalesIds: number[] = []

    try {
      oldSales = await this.openSeaAPI.fetchParsedSaleEvents()

      for (let i=0; i<this.range; i++) {
        oldSalesIds.push(oldSales[i].saleId)
      }
    } catch (error) {
      console.log(error)
      return
    }

    while(true) {
      let newSales: [Sale] = null;
      let newSalesIds: number[] = []

      const date = new Date();
      const formattedTime = date.toLocaleTimeString("en-US")

      try {
        newSales = await this.openSeaAPI.fetchParsedSaleEvents()

        for (let i=0; i<this.range; i++) {
          newSalesIds.push(oldSales[i].saleId)
        }
      } catch (error) {
        console.log(error, "\n")
        continue
      }

      let latestSalesIds: number[] = newSalesIds
        .filter(id => !oldSalesIds.includes(id))
        .concat(oldSalesIds.filter(id => !newSalesIds.includes(id)));

      if (latestSalesIds.length > 0) {
        for (let i=0; i<latestSalesIds.length; i++) {
          console.log(`${formattedTime} - New Sale ID#${latestSalesIds[i]}`)

          for (let j=0; j<newSales.length; j++) {
            if (newSales[j].saleId == newSalesIds[i]) {

              const smartContract = newSales[j].asset.collection.slug
              const tokenId = newSales[j].asset.tokenId

              console.log(smartContract)
              console.log(tokenId)

              try {
                const tokenSales = await this.openSeaAPI.fetchParsedSaleEvents(tokenId)

                if (tokenSales.length > 1) {
                  const tweetText = composeTweet(tokenSales[tokenSales.length-2], tokenSales[tokenSales.length-1].salePrice)
            
                  if (tweetText) {
                    console.log(tweetText)
                    this.twitterAPI.postTweet(tweetText)
                  }
                }
              } catch (error) {
                console.log(error, "\n")
                continue
              }
            }
          }
        }
      } else {
        console.log(`${formattedTime} - No new sales!`)
      }

      oldSales = newSales
      oldSalesIds = newSalesIds

      // Polls the OpenSea API every 10 seconds
      await delayBy(10000);
    }
  }
}

const twitterBot = new TwitterMcBot()
twitterBot.runInstance()
