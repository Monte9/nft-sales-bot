import 'dotenv/config';

import CoinbaseAPI from '../api/CoinbaseAPI';
import OpenSeaAPI from '../api/OpenSeaAPI';
import LeaderboardAPI from '../api/LeaderboardAPI';

import { getSaleData } from './SaleData';

import { Collection, LeaderboardSale, Sale, SaleData } from '../types';

import { CollectionSlug } from '../shared/Constants';
import { getCollectionFromSlug } from '../shared/Helpers';

export default class Leaderboard {
  coinbaseAPI: CoinbaseAPI = null
  openSeaAPI: OpenSeaAPI = null
  leaderboardAPI: LeaderboardAPI = null

  constructor() {
    this.coinbaseAPI = new CoinbaseAPI();
    this.openSeaAPI = new OpenSeaAPI();
    this.leaderboardAPI = new LeaderboardAPI();
  }

  async start() {
    console.log(`Starting NFT Leaderboard`)

    const collection = getCollectionFromSlug(CollectionSlug.boredapeyachtclub)
    const tokenID = '4098'
    
    try {
      const tokenSales: Sale[] = await this.openSeaAPI.fetchSaleEventsForToken(collection.address, tokenID)
      const boughtTransaction = tokenSales[2]
      const soldTransaction = tokenSales[1]
      
      // If only 1 sale exists, it's not considered a FLIP - just ignore it
      if (tokenSales.length < 2) {
        console.log(`${collection.symbol} #${tokenID} only has 1 sales event`)
        return
      }

      const sale = await getSaleData({
        purchase: boughtTransaction,
        sale: soldTransaction,
        coinbaseAPI: this.coinbaseAPI,
      })

      // Save the Sale in the Leaderboard database
      await this.saveSaleInDatabase(collection, tokenID, sale, soldTransaction)
    } catch (error) {
      console.log(`Unable to get Sales Events for ${collection.symbol} #${tokenID}:`, error.message)
    }
  }

  async saveCollectionInDatabase(collection: Collection, currentFloorPrice: number, profitThresholdETH: number) {
    // Setup collectionData
    const collectionData = {
      collection,
      floorPrice: currentFloorPrice,
      profitThreshold: profitThresholdETH
    }

    // Send collectionData to the NFT Leaderboard API
    try {
      await this.leaderboardAPI.saveCollectionData(collectionData)
      console.log(`Leaderboard API: ${collection.slug} collection updated`)
    } catch (error) {
      console.log(`Leaderboard API: ERROR unable to save ${collection.slug} collection -`, error.message)
    }
  }

  async saveSaleInDatabase(collection: Collection, tokenID: string, sale: SaleData, soldTransaction: Sale) {
    const saleData: LeaderboardSale = {
      collection,
      sale,
      openseaSaleId: soldTransaction.openseaSaleId,
      timestamp: soldTransaction.timestamp,
      transactionHash: soldTransaction.transactionHash
    }

    // Send saleData to the NFT Leaderboard API
    try {
      await this.leaderboardAPI.saveSaleData(saleData)
      console.log(`Leaderboard API: ${collection.symbol} #${tokenID} sale updated`)
    } catch (error) {
      console.log(`Leaderboard API: ERROR unable to save ${collection.symbol} #${tokenID} sale -`, error.message)
    }
  }
}
