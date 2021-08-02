import fetch from 'node-fetch';

import { isError } from '../utils/Helpers';

export default class CoinbaseAPI {
  // https://developers.coinbase.com/api/v2#get-spot-price
  async getUSDPriceForETH(date: string): Promise<number | Error> {
    const url = 'https://api.coinbase.com/v2/prices/ETH-USD/spot';
    let params = `date=${date}`

    const options = {
      method: 'GET', 
      headers: {
        Accept: 'application/json'
      }
    };

    const response = await fetch(`${url}?${params}`, options)
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
      return response.message
    } else if (!response || !response.data || !response.data.amount) {
      return Error('Missing response data with USD value');
    }

    const amount = Number(response.data.amount)
    return Math.round(amount)
  }
}
