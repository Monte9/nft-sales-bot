import { GraphQLClient, gql } from 'graphql-request'

import { Collection } from '../types'
import { Collection as DBCollection, Collection_Mutation_Response, Mutation_Root } from '../graphql/generated'

export default class DearEarthAPI {
  // The GraphQL Client for making the request
  // Sets up the URL & API Key for making the request
  graphQLClient = new GraphQLClient(
    process.env.DEAR_EARTH_HASURA_GRAPHQL_ENDPOINT, {
    headers: {
      'X-Hasura-Admin-Secret': process.env.DEAR_EARTH_HASURA_GRAPHQL_API_KEY,
    },
  })

  async saveCollectionData(collection: Collection, floorPrice: number, profitThreshold: number) {    
    const UPSERT_COLLECTION = gql`
      mutation UpsertCollection($collection: [collection_insert_input!]!, $updateCollectionRow: [collection_update_column!]!) {
        insert_collection(objects: $collection, on_conflict: {update_columns: $updateCollectionRow, constraint: collection_pkey}) {
          returning {
            address
            name
            floorPrice
            profitThreshold
            slug
            symbol
            twitterUsername
            displaySymbol
          }
        }
      }
    `;

    const variables = {
      collection: {
        ...collection,
        floorPrice,
        profitThreshold
      },
      updateCollectionRow: [
        "address",
        "floorPrice",
        "name",
        "profitThreshold",
        "slug",
        "symbol",
        "twitterUsername",
        "displaySymbol"
      ]
    }

    // Update collection data on the DearEarth API
    try {
      const data: Mutation_Root = await this.graphQLClient.request(UPSERT_COLLECTION, variables)
      const collectionData: Collection_Mutation_Response = data.insert_collection
      const updatedCollection: DBCollection = collectionData.returning[0]

      console.log(`DearEarth API: Collection ${updatedCollection.slug} updated`)
    } catch (error) {
      console.log(`DearEarth API: ERROR unable to save ${collection.slug} collection -`, error.message)
    }
  }
}