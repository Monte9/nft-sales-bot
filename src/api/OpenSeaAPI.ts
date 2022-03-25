import fetch from 'node-fetch'

import { parseSales } from '../core/OpenSea'
import { Sale } from '../types'
import { isError } from '../utils/API'

export default class OpenSeaAPI {
  // The URL for the /events endpoint on OpenSea
  eventsURL = 'https://api.opensea.io/api/v1/events'

  // The request options for making a GET request
  // Includes the x-api-key for OpenSea to bypass the rate limiting
  getOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'x-api-key': process.env.OPENSEA_API_KEY
    }
  }

  // API: /v1/events
  // https://docs.opensea.io/reference/retrieving-asset-events
  async fetchSaleEventsForCollection(collectionSlug: string): Promise<Sale[]> {
    const params = `only_opensea=false&collection_slug=${collectionSlug}&event_type=successful`

    const response = await fetch(`${this.eventsURL}?${params}`, this.getOptions)
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
    } else if (
      !response ||
      !response.asset_events ||
      response.asset_events.length == 0
    ) {
      throw Error('no sale events')
    }

    return parseSales(response.asset_events)
  }

  // API: /v1/events
  // https://docs.opensea.io/reference/retrieving-asset-events
  async fetchSaleEventsForToken(
    assetContractAddress: string,
    tokenId: number,
    eventType = 'successful'
  ): Promise<Sale[]> {
    const params = `only_opensea=false&asset_contract_address=${assetContractAddress}&token_id=${tokenId}&event_type=${eventType}`

    const response = await fetch(`${this.eventsURL}?${params}`, this.getOptions)
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
    } else if (
      !response ||
      !response.asset_events ||
      response.asset_events.length == 0
    ) {
      throw Error('no sale events')
    }

    return parseSales(response.asset_events)
  }
}
