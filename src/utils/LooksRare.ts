export function getLooksRareTokenURL(
  collectionAddress: string,
  tokenId: string
) {
  const looksRareBaseURL = 'https://looksrare.org/collections/'
  return `${looksRareBaseURL}/${collectionAddress}/${tokenId}#activity`
}
