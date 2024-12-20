export function getCookie(cookiename: string): string {
  // Get name followed by anything except a semicolon
  const cookiestring = RegExp(cookiename + '=[^;]+').exec(document.cookie)
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(cookiestring ? cookiestring.toString().replace(/^[^=]+./, '') : '')
}
