import fetch from 'node-fetch';

import { FloorPrice } from '../types';

import { isError } from '../shared/Helpers';

export default class FloorAPI {
  // The URL for the /floor endpoint
  floorURL = 'https://9b5uos52uh.execute-api.us-east-1.amazonaws.com/prod/freeFloors';

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
    } else if (!response || response.length == 0) {
      throw Error('missing data from API');
    }

    return parseFloorPrices(response)
  }
}

export function parseFloorPrices(collections): FloorPrice[] {
  console.log(collections[0])

  return collections.reduce((acc, collection) => {
    let info: FloorPrice = {
      name: collection.project_name,
      currentFloor: collection.project_floor,
      lastUpdated: collection.last_updated,
      activityUrl: collection.activity_url,
      url: collection.project_url,
    }

    acc.push(info)
    return acc;
  }, [])
}
