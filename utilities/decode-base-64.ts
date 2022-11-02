export const decodeBase64 = (string: string): string => {
  const buff = Buffer.from(string, 'base64')
  return buff.toString('utf8')
}
