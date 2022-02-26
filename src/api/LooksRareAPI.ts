import { GraphQLClient, gql } from 'graphql-request'
import { LooksRareTransaction } from '../types';
 
export default class LooksRareAPI {
 // The GraphQL Client for making the request
 graphQLClient = new GraphQLClient('https://api.thegraph.com/subgraphs/name/looksrare/exchange')
 
 // https://thegraph.com/hosted-service/subgraph/looksrare/exchange
 // DOCS: https://docs.looksrare.org/developers/subgraph-documentation/exchange
 async fetchTransactions() {
   const QUERY_TRANSACTIONS = gql`
    query GetTransactions($date: BigInt!){
      transactions(
        orderBy: date
        orderDirection: desc
        where: {price_gt: 10, date_gt: $date}
      ) {
        id
        date
        collection {
          id
        }
        tokenId
        price
        date
      }
    }
   `;
 
   try {
     const data = await this.graphQLClient.request(QUERY_TRANSACTIONS, {date: 1645855200})
     const transactions: LooksRareTransaction[] = data && data.transactions
 
     if (!transactions || transactions == null || transactions == undefined || transactions.length === 0) {
       throw new Error('missing transactions')
     }
 
     return transactions
   } catch (error: any) {
     throw new Error(`query transactions in LooksRareAPI failed: ${error.message}`)
   }
 }
}
