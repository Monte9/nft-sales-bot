import FloorAPI from '../api/FloorAPI'
import { ALLOWLISTED_COLLECTIONS } from '../shared/Allowlist'
import { Collection, FloorPrice } from '../types'

export function getCollectionFromSlug(slug: string) {
  return ALLOWLISTED_COLLECTIONS.find((collection) => collection.slug === slug)
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
    console.error(`Unable to get floor prices: ${error}`)
    return { currentFloor: 0 }
  }

  if (floorPrices && floorPrices.length > 0) {
    const result = floorPrices.find((floorPrice) => {
      return collection.name === floorPrice.name
    })

    // If we found the floor price for the collection just return it
    if (result) {
      return result
    } else {
      return emptyFloorPrice
    }
  }

  return emptyFloorPrice
}
