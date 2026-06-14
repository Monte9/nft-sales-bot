import { ALLOWLISTED_COLLECTIONS } from '../shared/Allowlist'

export function getCollectionFromSlug(slug: string) {
  return ALLOWLISTED_COLLECTIONS.find((collection) => collection.slug === slug)
}

export function getCollectionFromAddress(address: string) {
  if (!address) {
    return undefined
  }

  return ALLOWLISTED_COLLECTIONS.find(
    (collection) => collection.address.toLowerCase() === address.toLowerCase()
  )
}
