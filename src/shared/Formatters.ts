import moment from 'moment-timezone';

export function addCommas(value: number): String {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function rounded(value: number): number {
  return Math.round(value * 100) / 100
}

export const getCurrentTime = (): string => {
  return moment.tz('Asia/Kolkata').format("MMM Do, hh:mm A")
}

export const getShortWalletAddress = (address): string => {
  return address.slice(0, 6) + '..' + address.substr(address.length - 4)
}

export const getYMDaysBetween = (start: string, end: string): string => {
  const startDate = moment(start)
  const endDate = moment(end)
  const duration = moment.duration(startDate.diff(endDate));
  const days = duration.days()
  const months = duration.months()
  const years = duration.years()

  let durationString = ""

  if (years > 0) {
    const yearsString = years === 1 ? 'year' : 'years'
    durationString = durationString + `${years} ${yearsString} `
  }

  if (months > 0) {
    const monthsString = months === 1 ? 'month' : 'months'
    durationString = durationString + `${months} ${monthsString} `
  }

  if (days != 0) {
    const daysString = days === 1 ? 'day' : 'days'
    durationString = durationString + `${days} ${daysString}`
  }

  // Sometimes the days can be 0 as the trade happened on the same day
  // So check if it's empty and default to 1 day
  // Verify with Token 6002
  if (!durationString) {
    durationString = "1 day"
  }

  return durationString
}

export const getTotalDaysBetween = (start: string, end: string): number => {
  const startDate = moment(start)
  const endDate = moment(end)
  const duration = moment.duration(startDate.diff(endDate));
  const days = duration.asDays()

  // If the trade happens on the same day, the days is < 1
  // In this case, let's round up to 1 day
  if (days < 1) {
    return Math.ceil(days)
  }

  // Typically we want to round down the days
  // We do this to match the duration.days() call
  return Math.floor(days)
}
