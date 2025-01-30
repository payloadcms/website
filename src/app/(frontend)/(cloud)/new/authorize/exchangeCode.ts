export const exchangeCode = async (code: string): Promise<boolean> => {
  if (code) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/exchange-code?code=${code}`,
        {
          credentials: 'include',
          method: 'GET',
        },
      )

      const body = await res.json()

      if (res.ok) {
        return true
      } else {
        throw new Error(body.message)
      }
    } catch (err: unknown) {
      const message = `Unable to authorize GitHub: ${err}`
      console.error(message) // eslint-disable-line no-console
      throw new Error(message)
    }
  }

  return false
}
