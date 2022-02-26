import { GraphQLClient, gql } from 'graphql-request'
import { LooksRareTransaction } from '../types';

// https://thegraph.com/hosted-service/subgraph/looksrare/exchange
// DOCS: https://docs.looksrare.org/developers/subgraph-documentation/exchange
// Graphiql Playground: https://api.thegraph.com/subgraphs/name/looksrare/exchange/graphql 
export default class LooksRareAPI {
 // The GraphQL Client for making the request
 graphQLClient = new GraphQLClient('https://api.thegraph.com/subgraphs/name/looksrare/exchange')
 
 async fetchTransactions(sinceDate: number) {
   const QUERY_TRANSACTIONS = gql`
    query GetTransactions($date: BigInt!) {
      transactions(
        orderBy: date
        orderDirection: desc
        where: {price_gt: 10, date_gt: $date}
      ) {
        id
        date
        tokenId
        price
        date
        collection {
          id
          totalRoyaltyPaid
          totalTransactions
          totalVolume
        }
      }
    }
   `;
 
   try {
     const data = await this.graphQLClient.request(QUERY_TRANSACTIONS, {date: sinceDate})
     const allTransactions: LooksRareTransaction[] = data && data.transactions
 
     if (!allTransactions || allTransactions == null || allTransactions == undefined) {
       throw new Error('missing transactions')
     }

     // Filter out the transactions that don't have collection royalties
     // This filters out the wash trading going on
     const transactions = allTransactions.filter(transaction => {
       if (Number(transaction.collection.totalRoyaltyPaid) > 0) {
         return true
       }
     })
 
     return transactions
   } catch (error: any) {
     throw new Error(`query transactions in LooksRareAPI failed: ${error.message}`)
   }
 }
}
