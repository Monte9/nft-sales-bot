import 'dotenv/config';

import CoinbaseAPI from '../api/CoinbaseAPI';
import FloorAPI from '../api/FloorAPI';
import OpenSeaAPI from '../api/OpenSeaAPI';
import TwitterAPI from '../api/TwitterAPI';

import { getSaleData } from './SaleData';

import { CollectionSlug } from '../shared/Constants';

import { getCollectionFromSlug } from '../shared/Helpers';

export default class Leaderboard {
  coinbaseAPI: CoinbaseAPI = null
  floorAPI: FloorAPI = null
  openSeaAPI: OpenSeaAPI = null
  twitterAPI: TwitterAPI = null

  constructor() {
    this.coinbaseAPI = new CoinbaseAPI();
    this.openSeaAPI = new OpenSeaAPI();
    this.floorAPI = new FloorAPI();

    this.twitterAPI = new TwitterAPI(
      process.env.TWITTER_API_KEY,
      process.env.TWITTER_API_SECRET_KEY,
      process.env.TWITTER_ACCESS_TOKEN,
      process.env.TWITTER_ACCESS_TOKEN_SECRET,
    );
  }

  async start() {
    console.log(`Starting NFT Leaderboard`)

    const collection = getCollectionFromSlug(CollectionSlug.boredapeyachtclub)
    const tokenID = '4098'
    
    try {
      const tokenSales = await this.openSeaAPI.fetchSaleEventsForToken(collection.address, tokenID)
      
      // If only 1 sale exists, it's not considered a FLIP - just ignore it
      if (tokenSales.length < 2) {
        console.log(`${collection.symbol} #${tokenID} only has 1 sales event`, '\n')
        return
      }

      const salesData = await getSaleData({
        purchase: tokenSales[1],
        sale: tokenSales[0],
        coinbaseAPI: this.coinbaseAPI,
      })

      // Make API request to NFT Leaderboard & store in Database
      console.log(salesData)
    } catch (error) {
      console.log(`Unable to get Sales Events for ${collection.symbol} #${tokenID}:`, error.message)
    }
  }
}