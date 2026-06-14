import fetch from 'node-fetch'

import { parseSales } from '../core/OpenSea'
import { Sale } from '../types'
import { isError } from '../utils/API'
import {
  getCollectionFromAddress,
  getCollectionFromSlug
} from '../utils/OpenSea'

export default class OpenSeaAPI {
  // Base URL for the OpenSea v2 API.
  // The v1 /api/v1/events endpoint was sunset and now returns HTTP 410 Gone.
  baseURL = 'https://api.opensea.io/api/v2'

  // The request options for making a GET request
  // Includes the x-api-key for OpenSea to bypass the rate limiting
  getOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'x-api-key': process.env.OPENSEA_API_KEY
    }
  }

  // API: GET /api/v2/events/collection/{slug}
  // https://docs.opensea.io/reference/list_events_by_collection
  async fetchSaleEventsForCollection(collectionSlug: string): Promise<Sale[]> {
    const url = `${this.baseURL}/events/collection/${collectionSlug}?event_type=sale&limit=50`

    const response = await this.get(url)

    return parseSales(
      response.asset_events,
      getCollectionFromSlug(collectionSlug)
    )
  }

  // API: GET /api/v2/events/chain/{chain}/contract/{address}/nfts/{identifier}
  // https://docs.opensea.io/reference/list_events_by_nft
  async fetchSaleEventsForToken(
    assetContractAddress: string,
    tokenId: number,
    eventType = 'successful'
  ): Promise<Sale[]> {
    const url = `${
      this.baseURL
    }/events/chain/ethereum/contract/${assetContractAddress}/nfts/${tokenId}?${this.eventTypeParams(
      eventType
    )}&limit=50`

    const response = await this.get(url)

    return parseSales(
      response.asset_events,
      getCollectionFromAddress(assetContractAddress)
    )
  }

  // Maps the legacy v1 `event_type` values onto their v2 equivalents.
  // v1 'successful' -> v2 'sale'. Mints are a distinct 'mint' type in v2, so
  // the transfer lookup (used to find a token's mint) asks for both.
  private eventTypeParams(eventType: string): string {
    if (eventType === 'transfer') {
      return 'event_type=transfer&event_type=mint'
    }

    return 'event_type=sale'
  }

  // Shared GET helper: validates the HTTP status and the payload shape.
  private async get(url: string) {
    const response = await fetch(url, this.getOptions)
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

    return response
  }
}
