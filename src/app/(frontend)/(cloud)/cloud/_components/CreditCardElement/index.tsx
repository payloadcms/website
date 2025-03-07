import { useThemePreference } from '@root/providers/Theme/index'
import { CardElement as StripeCardElement } from '@stripe/react-stripe-js'
import { type StripeCardElementChangeEvent } from '@stripe/stripe-js'
import React, { useCallback, useEffect, useState } from 'react'

import classes from './index.module.scss'

export const CreditCardElement: React.FC<{
  onChange?: (StripeCardElementChangeEvent) => void
}> = ({ onChange }) => {
  const [error, setError] = useState(null)
  const [disableChangeHandler, setDisableChangeHandler] = useState(true)
  const { theme } = useThemePreference()
  const [style, setStyle] = useState<{ style: Record<string, unknown> }>()

  const handleChange = useCallback(async (event) => {
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
          color,
          fontWeight: '500',
          iconColor: color,
          // fontFamily,
          '::placeholder': {
            color: lightColor,
          },
          ':-webkit-autofill': {
            color: autoFillColor,
          },
          fontSize: '16px',
          fontSmoothing: 'antialiased',
        },
        empty: {
          color,
          iconColor: color,
        },
        invalid: {
          color: errorColor,
          iconColor: errorColor,
        },
      },
    })
  }, [theme])

  return (
    <div className={classes.cardElement}>
      {error && <p className={classes.error}>{error}</p>}
      <StripeCardElement
        className={classes.element}
        id="card-element"
        onChange={(e) => {
          // `onChange` here acts more like `onError` where it does not fire when the value changes
          // instead, it only fires when Stripe revalidates the field, i.e. on focus, blur, complete, submit, etc
          if (!disableChangeHandler) {
            handleChange(e)
          }
          if (typeof onChange === 'function') {
            onChange(e)
          }
        }}
        options={style}
      />
    </div>
  )
}
