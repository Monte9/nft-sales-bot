import fetch from 'node-fetch';

import { parseSales } from '../core/OpenSea';
import { Sale } from '../types/OpenSeaSale';

export default class OpenSeaAPI {
  smartContract: string = null
  eventType = 'successful'
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

    // If there are no saleEvents - throw an error
    if (saleEvents == null || saleEvents.length == 0) {
      console.log(response)
      throw new Error("Missing events from OpenSea Events API\n")
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
      .catch(error => {
        return Error(error);
      });
  }
}
