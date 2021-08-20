import OpenSeaAPI from "../../api/OpenSeaAPI";
import TwitterAPI from "../../api/TwitterAPI";

import { MentionsBot, SalesBot } from "../../types/NFTSalesBot";
import { Sale } from "../../types/OpenSeaSale";

import { NFT_COLLECTIONS } from "../../shared/Constants";

export async function getCollectionsDataFromOpenSea(): Promise<SalesBot[]> {
  return await Promise.all(
    NFT_COLLECTIONS.map(async (collection): Promise<SalesBot | null> => {
      const openSeaAPI = new OpenSeaAPI(collection.address)
      let oldSales: Sale[] = null;
      let oldSalesIds: number[] = []
  
      let salesBot = {
        collection,
        openSeaAPI,
        oldSalesIds
      }
  
      try {
        oldSales = await openSeaAPI.fetchParsedSaleEvents()
        
        for (let i=0; i<oldSales.length; i++) {
          oldSalesIds.push(oldSales[i].saleId)
        }
  
        console.log(`Got ${oldSales.length} sales events for ${collection.name}`)
      } catch (error) {
        console.log(`Unable to get ${collection.slug} Sales Events:`, error.message, '\n')
        return salesBot
      }
  
      // Update the oldSalesId on the salesBot
      salesBot.oldSalesIds = oldSalesIds
      return salesBot
    })
  )
}

export async function getMentionsDataFromOpenSea(twitterAPI: TwitterAPI): Promise<MentionsBot> {
  let oldMentionIds: string[] = []
  let mentionsBot: MentionsBot = {
    oldMentionIds
  }

  try {
    const mentions = await twitterAPI.fetchParsedMentions();
    for (let i=0; i<mentions.length; i++) {
      oldMentionIds.push(mentions[i].tweetId)
    }

    console.log(`Got ${oldMentionIds.length} OLD mentions`)
  } catch (error) {
    console.log(`Unable to get Twitter Mentions:`, error.message, '\n')
    return mentionsBot
  }

  // Update the oldMentionIds on the mentionsBot
  mentionsBot.oldMentionIds = oldMentionIds
  return mentionsBot
}
