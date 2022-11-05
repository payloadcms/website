export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const monthNamesAbbr = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
]

const formatOptions: { [key: string]: Intl.DateTimeFormatOptions } = {
  longDateStamp: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  shortDateStamp: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
}

interface Args {
  date: string | Date
  format?: 'longDateStamp' | 'shortDateStamp'
}
export function formatDate(args: Args): string {
  const { date, format = 'longDateStamp' } = args

  try {
    const dateObj = new Date(date)
    const options = formatOptions[format]
    return new Intl.DateTimeFormat('en-US', options).format(dateObj)
  } catch (e: unknown) {
    console.error('Error formatting date', e)
    return String(date)
  }
}
