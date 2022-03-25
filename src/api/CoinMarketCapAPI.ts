import fetch from 'node-fetch';
import { isError } from '../utils/API';

export default class CoinMarketCapAPI {
  // The URL for the /quotes endpoint on CoinMarketCap
  private quotesURL = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest';

  // The request options for making a GET request
  // Includes the X-CMC_PRO_API_KEY for authentication
  private getOptions = {
    method: 'GET', 
    headers: {
      Accept: 'application/json',
      'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY,
    }
  };

  // API: /v2/cryptocurrency/quotes/latest
  // https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyQuotesLatest
  async getLatestQuote(): Promise<object> {
    // ApeCoin ID
    let params = `id=18876`

    const response = await fetch(`${this.quotesURL}?${params}`, this.getOptions)
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
    } else if (!response || !response.data) {
      throw Error('missing apecoin data');
    }

    return response.data
  }
}
