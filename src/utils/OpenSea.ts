import FloorAPI from '../api/FloorAPI'
import { ACTIVE_NFT_COLLECTIONS, CollectionSlug } from '../shared/Constants'
import { Collection, FloorPrice } from '../types'

export function getCollectionFromSlug(slug: CollectionSlug) {
  return ACTIVE_NFT_COLLECTIONS.find((collection) => collection.slug === slug)
}

export async function getFloorPriceForCollection(
  collection: Collection
): Promise<FloorPrice> {
  const floorAPI = new FloorAPI()
  let floorPrices: FloorPrice[] = []
  const emptyFloorPrice = { currentFloor: 0 }

  try {
    floorPrices = await floorAPI.getFloorPrices()
  } catch (error) {
    console.log(`Unable to get floor prices: ${error}`)
    return { currentFloor: 0 }
  }

  if (floorPrices && floorPrices.length > 0) {
    const result = floorPrices.find(
      (floorPrice) => collection.name === floorPrice.name
    )

    // If we found the floor price for the collection just return it
    if (result) {
      return result
    } else {
      return emptyFloorPrice
    }
  }

  return emptyFloorPrice
}
