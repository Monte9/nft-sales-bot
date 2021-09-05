import FloorAPI from "../api/FloorAPI";
import { Collection, CollectionSlug, FloorPrice } from "../types";
import { NFT_COLLECTIONS } from "./Constants";

// https://stackoverflow.com/a/61958148
export function isError(obj) {
  if (!obj) { return false }

  return Object.prototype.toString.call(obj) === "[object Error]";
}

export function getCollectionFromSlug(slug: CollectionSlug) {
  return NFT_COLLECTIONS.find(collection => collection.slug === slug);
}

export async function getFloorPriceForCollection(collection: Collection): Promise<FloorPrice> {
  const floorAPI = new FloorAPI()
  let floorPrices: FloorPrice[] = [];

  try {
    floorPrices = await floorAPI.getFloorPrices()
  } catch (error) {
    console.log(`Unable to get floor prices. Skipping!`)
    return { currentFloor: 0 }
  }
  
  if (floorPrices && floorPrices.length > 0) {
    const result = floorPrices.find(floorPrice => 
      collection.alternateNames.includes(floorPrice.name)
    );
    
    // If we found the floor price for the collection just return it
    if (result) {
      return result
    }
  }
  
  return { currentFloor: 0 }
}
