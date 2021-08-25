import { OpenSeaCollection } from "../types/OpenSeaCollection";
import { CollectionSlug, CollectionSymbol, NFT_COLLECTIONS } from "./Constants";

// https://stackoverflow.com/a/61958148
export function isError(obj) {
  return Object.prototype.toString.call(obj) === "[object Error]";
}

export function getCollectionFromSymbol(symbol: CollectionSymbol) {
  return NFT_COLLECTIONS.find(collection => collection.symbol === symbol);
}

export function getCollectionFromSlug(collections: OpenSeaCollection[], slug: CollectionSlug) {
  return collections.find(collection => {
    // console.log(collection.slug)
    return collection.slug === slug
  });
}
