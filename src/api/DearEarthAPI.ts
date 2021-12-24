import { GraphQLClient, gql } from 'graphql-request'
import { Collection } from '../types'

export default class DearEarthAPI {
  // The GraphQL Client for making the request
  // Sets up the URL & API Key for making the request
  graphQLClient = new GraphQLClient(
    process.env.DEAR_EARTH_HASURA_GRAPHQL_ENDPOINT, {
    headers: {
      'X-Hasura-Admin-Secret': process.env.DEAR_EARTH_HASURA_GRAPHQL_API_KEY,
    },
  })

  async fetchCollections() {
    const query = gql`
      query Collections {
        collection {
          address
          created_at
          floorPrice
          name
          profitThreshold
          slug
          symbol
          twitterUsername
          updated_at
        }
      }
    `

    const data = await this.graphQLClient.request(query)
    const collections: Collection[] = data.collection
    console.log(collections.length)
  }
}