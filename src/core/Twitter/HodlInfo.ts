import { getYMDaysBetween } from '../../utils/DateTime'

export const HodlInfo = (soldDate, boughtDate) => {
  // Get HODL Duration
  const hodlDuration = getYMDaysBetween(soldDate, boughtDate)

  return `😬 hodl: ${hodlDuration}\n`
}
