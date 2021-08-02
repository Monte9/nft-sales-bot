import moment from 'moment';

export function addCommas(value: number): String {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const getDateFromISOString = (isoStringDate): string => {
  return moment(isoStringDate).format('MMMM Do, YYYY')
}

export const getDaysBetween = (start: string, end: string): string => {
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

  const daysString = days === 1 ? 'day' : 'days'
  durationString = durationString + `${days} ${daysString}`

  return durationString
}

export const getShortWalletAddress = (address): string => {
  return address.slice(0, 6) + '..' + address.substr(address.length - 4)
}
