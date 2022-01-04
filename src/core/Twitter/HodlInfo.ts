import { getYMDaysBetween } from "../../shared/Formatters"

export const HodlInfo = (soldDate, boughtDate) => {
  // Get HODL Duration
  const hodlDuration = getYMDaysBetween(soldDate, boughtDate)

  return `😬 hodl: ${hodlDuration}\n`
}
