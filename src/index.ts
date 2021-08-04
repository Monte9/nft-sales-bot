import 'dotenv/config';

import OpenSeaAPI from './api/OpenSeaAPI';
import TwitterAPI from './api/TwitterAPI';
import CoinbaseAPI from './api/CoinbaseAPI';

import { Sale } from './types/OpenSeaSale';

import { OPENSEA_CONTRACTS } from './shared/Constants';
import { getCurrentTime } from './shared/Formatters';

import { composeTweet } from './utils/Twitter';
import { delayBy } from './utils/Helpers';

class TwitterMcBot {
  twitterAPI: TwitterAPI = null
  openSeaAPI: OpenSeaAPI = null
  coinbaseAPI: CoinbaseAPI = null

  constructor() {
    this.twitterAPI = new TwitterAPI(
      process.env.TWITTER_CONSUMER_KEY,
      process.env.TWITTER_CONSUMER_SECRET,
      process.env.TWITTER_ACCESS_TOKEN,
      process.env.TWITTER_ACCESS_TOKEN_SECRET,
    )

    this.openSeaAPI = new OpenSeaAPI(OPENSEA_CONTRACTS[0]);
    this.coinbaseAPI = new CoinbaseAPI();
  }

  async runInstance() {
    console.log("Started NFT Flipping McBot")

    let oldSales: Sale[] = null;
    let oldSalesIds: number[] = []

    try {
      oldSales = await this.openSeaAPI.fetchParsedSaleEvents()

      for (let i=0; i<oldSales.length; i++) {
        oldSalesIds.push(oldSales[i].saleId)
      }
    } catch (error) {
      console.log("Unable to get Sales Events:", error.message)
      return
    }

    // DEBUG CODE ONLY
    // $0/ETH bug - date 2021-08-04T00:49:40 - token 4155
    // USDC sale - token 822
    // Annualized return 6071.77% - token 5333
    // Annualized return - https://twitter.com/dearearth_/status/1422797797179416576
    // const tokenID = '5333'

    // try {
    //   const tokenSales = await this.openSeaAPI.fetchParsedSaleEvents(tokenID)

    //   if (tokenSales.length > 1) {
    //     try {
    //       const tweetText = await composeTweet({
    //         purchase: tokenSales[1], 
    //         sale: tokenSales[0], 
    //         coinbaseAPI: this.coinbaseAPI
    //       })
    //       // this.twitterAPI.postTweet(tweetText)
    //       console.log(tweetText)
    //     } catch (error) {
    //       console.log("Unable to post Tweet:", error.message, "\n")
    //     }
    //   }
    // } catch (error) {
    //   console.log(`Unable to get Sales Events for ${tokenID}:`, error.message)
    // }
    // return

    while(true) {
      let newSales: Sale[] = null;
      let newSalesIds: number[] = []

      try {
        newSales = await this.openSeaAPI.fetchParsedSaleEvents()

        for (let i=0; i<newSales.length; i++) {
          newSalesIds.push(newSales[i].saleId)
        }
      } catch (error) {
        console.log(`Unable to get New Sales Events @ ${getCurrentTime()}:`, error.message, "\n")
        continue
      }

      let latestSalesIds: number[] = newSalesIds.filter(id => !oldSalesIds.includes(id))
        .concat(oldSalesIds.filter(id => !newSalesIds.includes(id)));

      if (latestSalesIds.length > 0) {
        for (let i=0; i<latestSalesIds.length; i++) {
          console.log(`${getCurrentTime()} - New Sale ID#${latestSalesIds[i]}`)

          for (let j=0; j<newSales.length; j++) {
            const tokenID = newSales[j].asset.tokenId

            if (latestSalesIds[i] === newSales[j].saleId) {
              try {
                const tokenSales = await this.openSeaAPI.fetchParsedSaleEvents(tokenID)

                if (tokenSales.length > 1) {
                  try {
                    const tweetText = await composeTweet({
                      purchase: tokenSales[1], 
                      sale: tokenSales[0], 
                      coinbaseAPI: this.coinbaseAPI
                    })
                    this.twitterAPI.postTweet(tweetText)
                  } catch (error) {
                    console.log("Unable to post Tweet:", error.message, "\n")
                  }
                } else {
                  console.log(`Token #${tokenID} only has 1 Sales Event`, "\n")
                }
              } catch (error) {
                console.log(`Unable to get Sales Events for ${tokenID}:`, error.message)
                continue
              }
            }
          }
        }
      } else {
        console.log(`${getCurrentTime()} - No new sales!`)
      }

      oldSales = newSales
      oldSalesIds = newSalesIds

      // Polls the OpenSea API every 60 seconds
      await delayBy(60000);
    }
  }
}

const twitterBot = new TwitterMcBot()
twitterBot.runInstance()
