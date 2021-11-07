import 'dotenv/config';

import CoinbaseAPI from '../api/CoinbaseAPI';
import OpenSeaAPI from '../api/OpenSeaAPI';
import LeaderboardAPI from '../api/LeaderboardAPI';

import { getSaleData } from '../core/SaleData';

import { Collection, LeaderboardSale, LeaderboardToken, Sale, SaleData } from '../types';

import { CollectionSlug } from '../shared/Constants';
import { getCollectionFromSlug, getOpenSeaLink, getTokenFromLeaderboardTokens } from '../shared/Helpers';

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

    // Get all the Tokens in the Collection
    try {
      var collectionTokens = await this.leaderboardAPI.getTokens(collection)
      console.log(`Leaderboard API: ${collectionTokens.length} TOKENS for ${collection.slug}`)
    } catch (error) {
      console.log(`Leaderboard API: ERROR unable to GET TOKENS for ${collection.slug} collection -`, error.message)
    }

    console.log(`\nGetting Sale Events for ${collection.name}`)

    for (let i=0; i<=100; i++) {
      // Dynamic tokenID
      const tokenID = i

      try {
        const tokenSales: Sale[] = await this.openSeaAPI.fetchSaleEventsForToken(collection.address, tokenID)

        // Get the token mint sale event
        const transferEvents = await this.openSeaAPI.fetchSaleEventsForToken(collection.address, tokenID, 'transfer')
        const mintSale = transferEvents[transferEvents.length-1]
        tokenSales.push(mintSale)

        const currentToken = getTokenFromLeaderboardTokens(collectionTokens, tokenID)

        if (currentToken && currentToken.salesCount === tokenSales.length-1) {
          console.log(`${collection.symbol} #${tokenID} has ${tokenSales.length-1} sale events (UP TO DATE)`)
          continue
        }

        // Save the Token in the Leaderboard database
        console.log(`\n${collection.symbol} #${tokenID} has ${tokenSales.length-1} sale events`)
        await this.saveTokenInDatabase(collection, tokenID, tokenSales.length-1)

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
        // If there are No Sale Events we handle that case as well
        if (error.message === 'no sale events') {
          const currentToken = getTokenFromLeaderboardTokens(collectionTokens, tokenID)
          if (currentToken && currentToken.salesCount === 0) {
            console.log(`${collection.symbol} #${tokenID} has ${0} sale events (UP TO DATE)`)
          } else {
            // Save the Token in the Leaderboard database
            console.log(`\n${collection.symbol} #${tokenID} has ${0} sale events`)
            await this.saveTokenInDatabase(collection, tokenID, 0)
          }
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
      console.log(`Leaderboard API: COLLECTION ${collection.slug} updated`)
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
      console.log(`Leaderboard API: SALE ${collection.symbol} #${tokenID} (${soldTransaction.openseaSaleId}) updated`)
    } catch (error) {
      console.log(`Leaderboard API: ERROR unable to save ${collection.symbol} #${tokenID} (${soldTransaction.openseaSaleId}) sale -`, error.message)
    }
  }

  async saveTokenInDatabase(collection: Collection, tokenID: number, salesCount: number) {
    const tokenData: LeaderboardToken = {
      collectionSlug: collection.slug,
      tokenId: tokenID,
      openSeaLink: getOpenSeaLink(collection, tokenID),
      salesCount
    }

    // Send tokenData to the NFT Leaderboard API
    try {
      await this.leaderboardAPI.saveTokenData(tokenData)
      console.log(`Leaderboard API: TOKEN ${collection.symbol} #${tokenID} (${salesCount} sales) updated`)
    } catch (error) {
      console.log(`Leaderboard API: ERROR unable to save TOKEN ${collection.symbol} #${tokenID} w/ ${salesCount} sales -`, error.message)
    }
  }
}
