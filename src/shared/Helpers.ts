import { CollectionSlug } from "../types";
import { NFT_COLLECTIONS } from "./Constants";

// https://stackoverflow.com/a/61958148
export function isError(obj) {
  if (!obj) { return false }

  return Object.prototype.toString.call(obj) === "[object Error]";
}

export function getCollectionFromSlug(slug: CollectionSlug) {
  return NFT_COLLECTIONS.find(collection => collection.slug === slug);
}
