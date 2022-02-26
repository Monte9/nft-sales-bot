import moment from 'moment-timezone';

export function addCommas(value: number): String {
  return value && value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0'
}

export function rounded(value: number): number {
  return Math.round(value * 100) / 100 || 0
}

export const getCurrentDateTime = (format: string = "MMM Do, hh:mm A"): string => {
  return moment.tz('America/Chicago').format(format)
}

// Get UNIX Timestamp: https://timestamp.online/timestamp/1645856871
export const getCurrentUnixTimeMinusFifteenMinutes = (): number => {
  return moment().subtract(15, 'minutes').unix()
}

export const getShortWalletAddress = (address): string => {
  return address.slice(0, 6) + '..' + address.substr(address.length - 4)
}

export const getShortDate = (date: string): string => {
  const momentDate = moment(date)
  return momentDate.format("MM/YYYY")
}

export const getYMDaysBetween = (start: string, end: string): string => {
  const startDate = moment(start)
  const endDate = moment(end)
  const duration = moment.duration(startDate.diff(endDate));
  
  // Get the time in mins, hrs, days, months and years
  const minutes = duration.minutes()
  const hours = duration.hours()
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

  if (days > 0) {
    const daysString = days === 1 ? 'day' : 'days'
    durationString = durationString + `${days} ${daysString} `
  }

  // If the duration is less than 1 day break it down further
  if (!durationString) {
    if (hours > 0) {
      const hoursString = hours === 1 ? 'hour' : 'hours'
      durationString = durationString + `${hours} ${hoursString} `
    }
    
    if (minutes > 0) {
      const minutesString = minutes === 1 ? 'minute' : 'minutes'
      durationString = durationString + `${minutes} ${minutesString}`
    }
  }

  // If there is still not duration then default to 1 day
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
