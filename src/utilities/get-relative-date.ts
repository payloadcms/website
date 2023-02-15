function getRelativeDate(incomingDate: Date): string {
  const date = new Date(incomingDate)
  const currentDate = new Date()
  const diff = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 3600 * 24))
  const diffInWeeks = Math.floor(diff / 7)
  const diffInMonths = Math.floor(diff / 30)
  const diffInYears = Math.floor(diff / 365)

  if (diff === 0) {
    return `today`
  }

  if (diff === 1) {
    return `yesterday`
  }

  if (diff < 7 && diff > 1) {
    return `${diff} days ago`
  }

  if (diffInWeeks === 1) {
    return `last week`
  }

  if (diffInWeeks > 1 && diffInWeeks <= 4) {
    return `${diffInWeeks} weeks ago`
  }

  if (diffInMonths === 1) {
    return `last month`
  }

  if (diffInMonths > 1 && diffInMonths <= 12) {
    return `${diffInMonths} months ago`
  }

  if (diffInYears === 1) {
    return `last year`
  }

  if (diffInYears > 1) {
    return `${diffInYears} years ago`
  }

  return `on ${date.toLocaleDateString()}`
}

export default getRelativeDate
