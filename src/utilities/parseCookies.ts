export default function parseCookies(cookieString: string): { [key: string]: string } {
  const list = {}

  if (cookieString) {
    cookieString.split(';').forEach((cookie) => {
      const parts = cookie.split('=')
      list[parts.shift()?.trim() || ''] = decodeURI(parts.join('='))
    })
  }

  return list
}
