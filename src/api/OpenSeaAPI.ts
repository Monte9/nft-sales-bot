import fetch from 'node-fetch';

import { parseCollections, parseSales } from '../core/OpenSea';

import { OpenSeaCollection } from '../types/OpenSeaCollection';
import { Sale } from '../types/OpenSeaSale';

export default class OpenSeaAPI {
  smartContract: string = null
  userWallet: string = '0x6e7592ff3C32c93A520A11020379d66Ab844Bf5B'
  eventType = 'successful'
  assetRange: number = 20

  constructor(smartContract, assetRange?) {
    this.smartContract = smartContract

    if (assetRange) {
      this.assetRange = assetRange
    }
  }

  // API: v1/events

  async fetchParsedSaleEvents(tokenId?: string): Promise<Sale[]> {
    let response = null

    // Get latest sale events from OpenSea
    try {
      response = await this.getSaleEvents(tokenId)
    } catch (error) {
      throw error
    }
    
    const saleEvents = response && response.asset_events

    // If there are no saleEvents - throw an error
    if (saleEvents == null || saleEvents.length == 0) {
      throw new Error(`Missing events from OpenSea api/v1/events - ${response.message}`)
    }

    return parseSales(saleEvents)
  }
  
  private async getSaleEvents(tokenId?: string) {
    const url = 'https://api.opensea.io/api/v1/events';
    let params = `only_opensea=false&asset_contract_address=${this.smartContract}&event_type=${this.eventType}&offset=0&limit=${this.assetRange}`

    // If tokenId exists, we want to get all sale events for just that specific token
    if (tokenId) {
      params = params + `&token_id=${Number(tokenId)}`
    }
    
    const options = {
      method: 'GET', 
      headers: {
        Accept: 'application/json',
        'x-api-key': process.env.OPENSEA_API_KEY,
      }
    };

    return await fetch(`${url}?${params}`, options)
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          return Error(response.statusText);
        }
      })
      .catch(error => {
        return Error(error);
      });
  }

  // API: v1/collections

  async fetchParsedCollections(): Promise<OpenSeaCollection[]> {
    let collections = null

    // Get all collections from OpenSea
    try {
      collections = await this.getCollections()
    } catch (error) {
      throw error
    }
    
    // If there are no collection returned - throw an error
    if (collections == null || collections.length < 1) {
      throw new Error(`Missing collections from OpenSea api/v1/collections - ${collections.message}`)
    }

    return parseCollections(collections)
  }

  private async getCollections() {
    this.assetRange = 300
    const url = 'https://api.opensea.io/api/v1/collections';
    let params = `asset_owner=${this.userWallet}&offset=0&limit=${this.assetRange}`

    const options = {
      method: 'GET', 
      headers: {
        Accept: 'application/json',
        'x-api-key': process.env.OPENSEA_API_KEY,
      }
    };

    return await fetch(`${url}?${params}`, options)
      .then(response => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          return Error(response.statusText);
        }
      })
      .catch(error => {
        return Error(error);
      });
  }
}
