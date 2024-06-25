import React, { useCallback, useEffect, useState } from 'react'
import { CardElement as StripeCardElement } from '@stripe/react-stripe-js'
import { type StripeCardElementChangeEvent } from '@stripe/stripe-js'

import { useThemePreference } from '@root/providers/Theme/index.js'

import classes from './index.module.scss'

export const CreditCardElement: React.FC<{
  onChange?: (StripeCardElementChangeEvent) => void
}> = ({ onChange }) => {
  const [error, setError] = useState(null)
  const [disableChangeHandler, setDisableChangeHandler] = useState(true)
  const { theme } = useThemePreference()
  const [style, setStyle] = useState<{ style: Record<string, unknown> }>()

  const handleChange = useCallback(async event => {
    // listen for changes in the `CardElement` and display any errors as they occur
    // prevent this from firing when the input is empty so the error does not show when first focusing the input
    setDisableChangeHandler(event.empty)
    setError(event.error ? event.error.message : '')
  }, [])

  // css vars and `inherit` do not work here because of the iframe
  // so we need to get their computed values
  // we also cannot get the theme vars bc they are not stored on the documentElement can be nested
  useEffect(() => {
    const documentStyle = window.getComputedStyle(document.documentElement)

    const color = documentStyle.getPropertyValue(
      theme === 'dark' ? '--color-base-150' : '--color-base-750',
    )

    const autoFillColor = documentStyle.getPropertyValue('--color-base-750')

    const errorColor = documentStyle.getPropertyValue('--color-error-500')?.trim()

    const lightColor = documentStyle
      .getPropertyValue(theme === 'dark' ? '--color-base-400' : '--color-base-600')
      ?.trim()

    // const fontFamily = documentStyle.getPropertyValue('--font-body')?.trim()

    setStyle({
      style: {
        base: {
          iconColor: color,
          color: color,
          fontWeight: '500',
          // fontFamily,
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          ':-webkit-autofill': {
            color: autoFillColor,
          },
          '::placeholder': {
            color: lightColor,
          },
        },
        invalid: {
          iconColor: errorColor,
          color: errorColor,
        },
        empty: {
          iconColor: color,
          color: color,
        },
      },
    })
  }, [theme])

  return (
    <div className={classes.cardElement}>
      {error && <p className={classes.error}>{error}</p>}
      <StripeCardElement
        id="card-element"
        options={style}
        onChange={e => {
          // `onChange` here acts more like `onError` where it does not fire when the value changes
          // instead, it only fires when Stripe revalidates the field, i.e. on focus, blur, complete, submit, etc
          if (!disableChangeHandler) handleChange(e)
          if (typeof onChange === 'function') onChange(e)
        }}
        className={classes.element}
      />
    </div>
  )
}
