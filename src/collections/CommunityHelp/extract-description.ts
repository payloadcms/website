export const extractDescription = (string: string): string => {
  if (!string) return ''

  let cleanedString = string.replace(/<\/?[^>]+(>|$)/g, '')

  cleanedString = cleanedString.replace(/[^a-zA-Z0-9 ]/g, '')

  const wordsArray = cleanedString.split(' ')

  const first15Words = wordsArray.slice(0, 20)

  const result = first15Words.join(' ')

  return result
}
