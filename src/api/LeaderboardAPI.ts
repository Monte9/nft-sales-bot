import fetch from 'node-fetch';

import { LeaderboardCollection, LeaderboardSale } from '../types';
import { isError } from '../shared/Helpers';

export default class LeaderboardAPI {
  // The URL for the leaderboard API
  leaderboardAPI = process.env.NODE_ENV === 'DEVELOPMENT' ? 'http://localhost:5000/api' : 'https://nft-leaderboard.herokuapp.com/api';

  // The request options for making a GET or POST request
  // Includes the x-api-key to access the private API
  fetchOptions = {
    method: 'GET', 
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': process.env.LEADERBOARD_API_KEY,
    },
    body: null
  };

  // API: /v1/collections
  // https://nft-leaderboard.herokuapp.com/api/v1/collections

  async saveCollectionData(collectionData: LeaderboardCollection) {
    // Add the collectionData as JSON to the body of the request
    this.fetchOptions.method = 'POST'
    this.fetchOptions.body = JSON.stringify(collectionData)

    const response = await fetch(`${this.leaderboardAPI}/v1/collection`, this.fetchOptions)
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
    }
  }

  // API: /v1/sales
  // https://nft-leaderboard.herokuapp.com/api/v1/sales

  async saveSaleData(saleData: LeaderboardSale) {
    // Add the collectionData as JSON to the body of the request
    this.fetchOptions.method = 'POST'
    this.fetchOptions.body = JSON.stringify(saleData)

    const response = await fetch(`${this.leaderboardAPI}/v1/sale`, this.fetchOptions)
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
    }
  }
}
