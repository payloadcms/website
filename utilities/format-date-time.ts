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

export const formatDateTime = (timestamp?: string): string | undefined => {
  const now = new Date()

  let date = now
  if (timestamp) {
    const dateFromTimestamp = new Date(timestamp.replace('T', ' ').replace(/-/g, '/'))
    // could return 'Invalid Date'
    // see https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
    if (
      Object.prototype.toString.call(dateFromTimestamp) === '[object Date]' &&
      !Number.isNaN(dateFromTimestamp.getTime())
    ) {
      date = dateFromTimestamp
    } else return timestamp
  }

  const months = date.getMonth()
  const days = date.getDate()
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // const seconds = date.getSeconds();

  // const MM = (months + 1 < 10) ? `0${months + 1}` : months + 1;
  const monthName = monthNames[months]
  const DD = days < 10 ? `0${days}` : days
  const YYYY = date.getFullYear()
  // const AMPM = hours < 12 ? 'AM' : 'PM';
  // const HH = hours > 12 ? hours - 12 : hours;
  // const MinMin = (minutes < 10) ? `0${minutes}` : minutes;
  // const SS = (seconds < 10) ? `0${seconds}` : seconds;
  return `${monthName} ${DD}, ${YYYY}`
}
