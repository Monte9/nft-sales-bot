import fetch from 'node-fetch'
import { isError } from '../utils/API'
import { getStandardDate } from '../utils/DateTime'

export default class CoinbaseAPI {
  // The request options for making a GET request
  // Includes the x-api-key for OpenSea to bypass the rate limiting
  getOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  }

  async getUSDPriceForETH(date: string): Promise<number> {
    // https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-prices#get-spot-price
    const spotPriceURL = 'https://api.coinbase.com/v2/prices/ETH-USD/spot'

    // Get the date for the price
    const formattedDate = getStandardDate(date)

    // The current date in YYYY-MM-DD format
    const params = `date=${formattedDate}`

    const response = await fetch(`${spotPriceURL}?${params}`, this.getOptions)
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json()
        } else {
          return Error(response.statusText)
        }
      })
      .catch((error) => {
        return Error(error)
      })

    if (isError(response)) {
      throw Error(response.message)
    } else if (!response || !response.data || !response.data.amount) {
      throw Error('missing USD/ETH price')
    }

    return Math.round(Number(response.data.amount))
  }
}
