import NFTSalesBot from "./core/NFTSalesBot"
import { CollectionSymbol, NFT_COLLECTIONS } from "./shared/Constants"
import { getCollectionFromSymbol } from "./shared/Helpers"

const BAYC_Collection = getCollectionFromSymbol(CollectionSymbol.BAYC);
const COOL_Collection = getCollectionFromSymbol(CollectionSymbol.COOL);

// Create an instance of NFTSalesBot
const flipMcBot = new NFTSalesBot(COOL_Collection)

// Fire up FlipMcBot in 3.. 2.. 1..
flipMcBot.runInstance()
