export const priceFromJSON = (priceJSON = '{}', showFree = true): string => {
  let price = ''

  try {
    const parsed = JSON.parse(priceJSON)

    const priceValue = parsed?.data[0].unit_amount
    const priceType = parsed?.data[0].type
    const interval = parsed?.data[0].recurring?.interval
    const intervalCount = parsed?.data[0].recurring?.interval_count

    if (priceValue === undefined && !showFree) {
      return price
    }

    price = (priceValue !== 0 ? priceValue / 100 : 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD', // TODO: use `parsed.currency`
    })

    if (priceType === 'recurring') {
      price += ` per ${
        intervalCount === 1 ? interval : `${intervalCount} ${interval}s`
      }`
    }
  } catch (e: unknown) {
    console.error(`Cannot parse priceJSON`) // eslint-disable-line no-console
  }

  return price
}
