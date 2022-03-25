import fetch from 'node-fetch';
import { isError } from '../utils/API';

export default class CoinbaseAPI {
  // The URL for the /spot-price endpoint on Coinbase
  spotPriceURL = 'https://api.coinbase.com/v2/prices/ETH-USD/spot';

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

  async getUSDPriceForETH(date: string): Promise<number> {
    let params = `date=${date}`

    const response = await fetch(`${this.spotPriceURL}?${params}`, this.getOptions)
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
    } else if (!response || !response.data || !response.data.amount) {
      throw Error('missing USD/ETH price');
    }

    return Math.round(Number(response.data.amount))
  }
}
