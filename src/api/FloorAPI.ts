import fetch from 'node-fetch';

import { FloorPrice } from '../types';

import { isError } from '../shared/Helpers';

export default class FloorAPI {
  // The URL for the /floor endpoint
  floorURL = 'https://hokvuhs3gi.execute-api.us-east-1.amazonaws.com/floors';

  // The request options for making a GET request
  // Includes the x-api-key for OpenSea to bypass the rate limiting
  getOptions = {
    method: 'GET', 
    headers: {
      Accept: 'application/json',
    }
  };

  // API: /v2/prices/ETH-USD/spot
  // https://developers.coinbase.com/api/v2#get-spot-price

  async getFloorPrices(): Promise<FloorPrice[]> {
    const response = await fetch(this.floorURL, this.getOptions)
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

    if (isError(response)) {
      throw Error(response.message);
    } else if (!response || !response['Items'] || response['Items'].length == 0) {
      throw Error('missing floor prices');
    }

    return parseFloorPrices(response['Items'])
  }
}

export function parseFloorPrices(floorPrices): FloorPrice[] {
  return floorPrices.reduce((acc, floorPrice) => {
    let price: FloorPrice = {
      name: floorPrice.name,
      currentFloor: floorPrice.currentFloor,
      lastUpdated: floorPrice.lastUpdated,
      activityUrl: floorPrice.activityUrl,
      url: floorPrice.url,
    }

    acc.push(price)
    return acc;
  }, [])
}
