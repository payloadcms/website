export const priceFromJSON = (priceJSON = '{}', showFree = true): string => {
  let price = ''

  if (!priceJSON || priceJSON === '{}') {
    return ''
  }

  try {
    const parsed = JSON.parse(priceJSON)

    const priceValue = parsed?.unit_amount
    const priceType = parsed?.type

    if (priceValue === undefined && !showFree) {
      return price
    }

    price = (priceValue !== 0 ? priceValue / 100 : 0).toLocaleString('en-US', {
      currency: 'USD', // TODO: use `parsed.currency`
      style: 'currency',
    })

    if (priceType === 'recurring') {
      price += ` per ${
        parsed.recurring.interval_count > 1
          ? `${parsed.recurring.interval_count} ${parsed.recurring.interval}`
          : parsed.recurring.interval
      }`
    }
  } catch (e: unknown) {
    console.error(`Cannot parse priceJSON`) // eslint-disable-line no-console
  }

  return price
}
