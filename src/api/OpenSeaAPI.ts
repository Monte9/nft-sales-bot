import fetch from 'node-fetch';

import { Sale } from '../types/OpenSeaSale';
import { parseSales } from '../utils/OpenSea';

export default class OpenSeaAPI {
  eventType = 'successful'
  smartContract: string = null
  assetRange: number = 20

  constructor(smartContract, assetRange?) {
    this.smartContract = smartContract

    if (assetRange) {
      this.assetRange = assetRange
    }
  }

  async fetchParsedSaleEvents(tokenId?: string): Promise<Sale[]> {
    let response = null

    // Get latest sale events from OpenSea
    try {
      response = await this.getSaleEvents(tokenId)
    } catch (error) {
      throw error
    }
    
    const saleEvents = response && response.asset_events

    // If missing saleEvents - nothing to do further
    if (saleEvents == null || saleEvents.length == 0) {
      console.log(response)
      throw new Error("Missing events from OpenSea Events API\n")
    }

    return parseSales(saleEvents)
  }
  
  async getSaleEvents(tokenId?: string) {
    const url = 'https://api.opensea.io/api/v1/events';
    let params = `only_opensea=false&asset_contract_address=${this.smartContract}&event_type=${this.eventType}&offset=0&limit=${this.assetRange}`

    if (tokenId) {
      params = params + `&token_id=${Number(tokenId)}`
    }
    
    const options = {
      method: 'GET', 
      headers: {
        Accept: 'application/json'
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
      .catch(error => console.error(error));
  }
}
