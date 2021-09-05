import fetch from 'node-fetch';

import { parseSales } from '../core/OpenSea';

import { Sale } from '../types/OpenSeaSale';

export default class OpenSeaAPI {
  smartContract: string = null

  constructor(smartContract) {
    this.smartContract = smartContract
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
    let params = `only_opensea=false&asset_contract_address=${this.smartContract}&event_type=successful&offset=0&limit=20`

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
}
