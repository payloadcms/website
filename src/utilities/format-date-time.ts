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
  dateAndTime: {
    day: 'numeric',
    hour: 'numeric',
    month: 'long',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timeZoneName: 'short',
    year: undefined,
  },
  dateAndTimeWithMinutes: {
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    month: 'long',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timeZoneName: 'short',
    year: undefined,
  },
  longDateStamp: {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
  shortDateStamp: {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  },
}

interface Args {
  date: Date | string
  format?: 'dateAndTime' | 'dateAndTimeWithMinutes' | 'longDateStamp' | 'shortDateStamp'
  timeZone?: string
}
export function formatDate(args: Args): string {
  const { date, format = 'longDateStamp' } = args

  try {
    const dateObj = new Date(new Date(date).toLocaleString('en-US'))

    const options = formatOptions[format]
    return new Intl.DateTimeFormat('en-US', options).format(dateObj)
  } catch (e: unknown) {
    console.error('Error formatting date', e) // eslint-disable-line no-console
    return String(date)
  }
}
