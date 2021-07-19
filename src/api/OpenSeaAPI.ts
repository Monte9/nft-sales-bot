import fetch from 'node-fetch';

import { Sale } from '../types/OpenSeaSale';
import { parseSales } from '../utils/OpenSea';

export default class OpenSeaAPI {
  assetRange = null
  smartContracts = []
  eventType = 'successful'

  constructor(range: number, smartContracts: string[]) {
    this.assetRange = range
    this.smartContracts = smartContracts;
  }

  async fetchParsedSaleEvents(): Promise<[Sale]> {
    let data = null

    // Get latest sale events from OpenSea
    try {
      data = await this.getSaleEvents()
    } catch (error) {
      throw error
    }
    
    const saleEvents = data && data.asset_events

    // If missing saleEvents - nothing to do further
    if (saleEvents == null || saleEvents.length == 0) {
      throw("Missing events from OpenSea Events API")
    }

    return parseSales(saleEvents)
  }
  
  async getSaleEvents() {
    const url = 'https://api.opensea.io/api/v1/events';
    let params = `only_opensea=false&offset=0&limit=${this.assetRange}&event_type=${this.eventType}&`
    
    this.smartContracts.map((contract, index) => {
      params =  params + `asset_contract_addresses=${contract}`
      
      // if it's not the last element append the & for the next query param
      if (index + 1 !== this.smartContracts.length) {
        params = params + '&'
      }
    })

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
          throw Error(response.statusText);
        }
      })
      .catch(error => console.error(error));
  }
}
