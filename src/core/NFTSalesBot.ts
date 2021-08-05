import 'dotenv/config';

import OpenSeaAPI from '../api/OpenSeaAPI';
import TwitterAPI from '../api/TwitterAPI';
import CoinbaseAPI from '../api/CoinbaseAPI';

import { composeTweet } from '../core/Twitter';

import { Collection, Sale } from '../types/OpenSeaSale';

import { getCurrentTime } from '../shared/Formatters';
import { delayBy } from '../shared/Helpers';

export default class NFTSalesBot {
  twitterAPI: TwitterAPI = null
  openSeaAPI: OpenSeaAPI = null
  coinbaseAPI: CoinbaseAPI = null
  collection: Collection = null

  constructor(collection: Collection) {
    this.collection = collection
    
    // Create a new instance of OpenSea API for the specific collection address
    this.openSeaAPI = new OpenSeaAPI(collection.address);

    // Initialize TwitterAPI with API keys
    this.twitterAPI = new TwitterAPI(
      process.env.TWITTER_API_KEY,
      process.env.TWITTER_API_SECRET_KEY,
      process.env.TWITTER_ACCESS_TOKEN,
      process.env.TWITTER_ACCESS_TOKEN_SECRET,
    )

    this.coinbaseAPI = new CoinbaseAPI();
  }

  async runBotInDebugMode() {
    // Bored Ape BUG: USDC sale - Token 822
    // Cool Cat - Token 5943
    const tokenID = '5943'

    try {
      const tokenSales = await this.openSeaAPI.fetchParsedSaleEvents(tokenID)

      if (tokenSales.length > 1) {
        try {
          const tweetText = await composeTweet({
            collection: this.collection,
            purchase: tokenSales[1], 
            sale: tokenSales[0], 
            coinbaseAPI: this.coinbaseAPI
          })
          // this.twitterAPI.postTweet(tweetText)
          console.log(tweetText, "\n")
        } catch (error) {
          console.log("Unable to post Tweet:", error.message)
        }
      } else {
        console.log(`Token #${tokenID} only has 1 Sales Event`, "\n")
      }
    } catch (error) {
      console.log(`Unable to get Sales Events for ${tokenID}:`, error.message)
    }
  }

  async runInstance() {
    console.log(`Starting NFT Sales Bot for ${this.collection.name} in ${process.env.NODE_ENV}`)

    // DEBUG CODE ONLY
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      this.runBotInDebugMode()
      return
    }

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

    // Run in Production
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
                      collection: this.collection,
                      purchase: tokenSales[1], 
                      sale: tokenSales[0], 
                      coinbaseAPI: this.coinbaseAPI
                    })
                    this.twitterAPI.postTweet(tweetText)
                  } catch (error) {
                    console.log("Unable to post Tweet:", error.message)
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
