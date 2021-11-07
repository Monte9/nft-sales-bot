import FloorAPI from "../api/FloorAPI";
import { Collection, FloorPrice, LeaderboardToken } from "../types";
import { ACTIVE_NFT_COLLECTIONS, CollectionSlug } from "./Constants";

// https://stackoverflow.com/a/61958148
export function isError(obj) {
  if (!obj) { return false }

  return Object.prototype.toString.call(obj) === "[object Error]";
}

export function getCollectionFromSlug(slug: CollectionSlug) {
  return ACTIVE_NFT_COLLECTIONS.find(collection => collection.slug === slug);
}

export function getOpenSeaLink(collection: Collection, tokenID: number) {
  return `https://opensea.io/assets/${collection.address}/${tokenID}`
}

export function getTokenFromLeaderboardTokens(tokens: LeaderboardToken[], tokenId: number): LeaderboardToken | undefined {
  return tokens.find(token => {
    return token.tokenId === tokenId
  })
}

export async function getFloorPriceForCollection(collection: Collection): Promise<FloorPrice> {
  const floorAPI = new FloorAPI()
  let floorPrices: FloorPrice[] = [];
  const emptyFloorPrice = { currentFloor: 0 }

  try {
    floorPrices = await floorAPI.getFloorPrices()
  } catch (error) {
    console.log(`Unable to get floor prices: ${error}`)
    return { currentFloor: 0 }
  }
  
  if (floorPrices && floorPrices.length > 0) {
    const result = floorPrices.find(floorPrice => 
      collection.name === floorPrice.name
    );
    
    // If we found the floor price for the collection just return it
    if (result) {
      return result
    } else {
      return emptyFloorPrice
    }
  }
  
  return emptyFloorPrice
}
