import { ALLOWLISTED_COLLECTIONS } from '../shared/Allowlist'

export function getCollectionFromSlug(slug: string) {
  return ALLOWLISTED_COLLECTIONS.find((collection) => collection.slug === slug)
}
