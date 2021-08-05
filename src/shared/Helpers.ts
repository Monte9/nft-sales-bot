import { CollectionSymbol, NFT_COLLECTIONS } from "./Constants";

// Returns a Promise that resolves after "ms" Milliseconds
export const delayBy = ms => new Promise(res => setTimeout(res, ms));

// https://stackoverflow.com/a/61958148
export function isError(obj) {
  return Object.prototype.toString.call(obj) === "[object Error]";
}

export function getCollectionFromSymbol(symbol: CollectionSymbol) {
  return NFT_COLLECTIONS.find(collection => collection.symbol === symbol);
}
