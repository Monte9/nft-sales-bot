import OpenSeaAPI from "../api/OpenSeaAPI";

import { Collection } from "./OpenSeaSale";

export interface SalesBot {
  collection: Collection
  openSeaAPI: OpenSeaAPI
  oldSalesIds: number[]
}
