import 'dotenv/config';

import CoinbaseAPI from '../api/CoinbaseAPI';
import OpenSeaAPI from '../api/OpenSeaAPI';
import LeaderboardAPI from '../api/LeaderboardAPI';

import { getSaleData } from '../core/SaleData';

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

    // Support multiple collections
    const collection = getCollectionFromSlug(CollectionSlug.boredapeyachtclub)
    console.log(`\nGetting Sale Events for ${collection.name}`)

    for (let i=95; i<=100; i++) {
      // Dynamic tokenID
      const tokenID = i

      try {
        const tokenSales: Sale[] = await this.openSeaAPI.fetchSaleEventsForToken(collection.address, tokenID)

        // Get the token mint sale event
        const transferEvents = await this.openSeaAPI.fetchSaleEventsForToken(collection.address, tokenID, 'transfer')
        const mintSale = transferEvents[transferEvents.length-1]
        tokenSales.push(mintSale)

        console.log(`\n${collection.symbol} #${tokenID} has ${tokenSales.length-1} sale events`)

        for (let i=0; i<tokenSales.length-1; i++) {
          const soldTransaction = tokenSales[i]
          const boughtTransaction = tokenSales[i+1]

          const sale = await getSaleData({
            purchase: boughtTransaction,
            sale: soldTransaction,
            coinbaseAPI: this.coinbaseAPI,
          })

          // Save the Sale in the Leaderboard database
          await this.saveSaleInDatabase(collection, tokenID, sale, soldTransaction)
        }
      } catch (error) {
        if (error.message === 'no sale events') {
          console.log(`\n${collection.symbol} #${tokenID} has 0 sale events`)
        } else {
          console.log(`Error: ${collection.symbol} #${tokenID} -`, error.message)
        }
      }
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

  async saveSaleInDatabase(collection: Collection, tokenID: number, sale: SaleData, soldTransaction: Sale) {
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
      console.log(`Leaderboard API: ${collection.symbol} #${tokenID} (${soldTransaction.openseaSaleId}) sale updated`)
    } catch (error) {
      console.log(`Leaderboard API: ERROR unable to save ${collection.symbol} #${tokenID} (${soldTransaction.openseaSaleId}) sale -`, error.message)
    }
  }
}
