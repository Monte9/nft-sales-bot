import OpenSeaAPI from "../../api/OpenSeaAPI"

import { TwitterMention } from "../../types/NFTSalesBot"
import { OpenSeaCollection } from "../../types/OpenSeaCollection"

import { CollectionSlug } from "../../shared/Constants"
import { getCollectionFromSlug } from "../../shared/Helpers"

// Compose a Reply for a Twitter Mention - Floor Prices
export async function composeFloorPricesReply(mention: TwitterMention, openSeaAPI: OpenSeaAPI): Promise<string> {
  const tweetText = mention.text.toLowerCase()
  const floorKeyword = 'floor'.toLowerCase()

  if (!tweetText.includes(floorKeyword)) {
    throw new Error(`missing ${floorKeyword} keyword`)
  }

  const wallets: string[] = [
    // Dear Earth
    // Animetas, Cool Cats
    '0x6e7592ff3C32c93A520A11020379d66Ab844Bf5B',
    // JeremiahAllenWelch
    // Meebits, 0n1 Force
    '0x58f7cdf32be333e5a5c7ff8097742ac5535b7a65',
    // Bogeli
    // Bored Apes & BAKC
    '0x36991b237b1a2c2eafd94274f11e589d3c041c95',
    // narendra
    // Gutter Cats
    '0x02c349ace1412e3ee40cc72f13ead686a7f08ae4'
  ]

  console.log('Getting floor prices for all collections')

  const allCollections = await Promise.all(
    wallets.map(async (address): Promise<OpenSeaCollection[] | null> => {
      let page = 0
      let pagedCollections: OpenSeaCollection[] = []

      while(true) {
        let collec: OpenSeaCollection[] = []

        try {
          collec = await openSeaAPI.fetchParsedCollections(address, page)
        } catch (error) {
          break
        }

        if (!collec || collec.length < 1) {
          break
        } else {
          pagedCollections.push(...collec)
          page = page + 1
        }
      }

      return pagedCollections
    })
  )

  console.log('')

  const collections = Array.prototype.concat.apply([], allCollections)

  let animetasCollection = getCollectionFromSlug(collections, CollectionSlug.animetas)
  let boredApesKCCollection = getCollectionFromSlug(collections, CollectionSlug.boredapekennelclub)
  let boredApesYCCollection = getCollectionFromSlug(collections, CollectionSlug.boredapeyachtclub)
  let coolCatsCollection = getCollectionFromSlug(collections, CollectionSlug.coolcatsnft)
  let gutterCatsCollection = getCollectionFromSlug(collections, CollectionSlug.guttercatgang)
  let meebitsCollection = getCollectionFromSlug(collections, CollectionSlug.meebits)
  let on1ForceCollection = getCollectionFromSlug(collections, CollectionSlug.on1force)

  let reply = 'These are the current floor prices 🧹\n\n'

  if (animetasCollection) {
    reply = reply + `🦹🏼 Animetas: ${animetasCollection.stats.floorPrice} ETH\n`
  }

  if (boredApesKCCollection) {
    reply = reply + `🐕 Bored Apes KC: ${boredApesKCCollection.stats.floorPrice} ETH\n`
  }
  
  if (boredApesYCCollection) {
    reply = reply + `🦍 Bored Apes YC: ${boredApesYCCollection.stats.floorPrice} ETH\n`
  }
  
  if (coolCatsCollection) {
    reply = reply + `🐱 CoolCats NFT: ${coolCatsCollection.stats.floorPrice} ETH\n`
  }

  if (gutterCatsCollection) {
    reply = reply + `🐈 Gutter Cat Gang: ${gutterCatsCollection.stats.floorPrice} ETH\n`
  }

  if (meebitsCollection) {
    reply = reply + `🤖 Meebits: ${meebitsCollection.stats.floorPrice} ETH\n`
  }

  if (on1ForceCollection) {
    reply = reply + `🦹🏼‍♂️ 0N1 Force: ${on1ForceCollection.stats.floorPrice} ETH\n`
  }

  return reply
}
