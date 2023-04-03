import React, { useEffect, useState } from 'react'
import { CardElement as StripeCardElement } from '@stripe/react-stripe-js'

import { useTheme } from '@root/providers/Theme'

import classes from './index.module.scss'

export const CreditCardElement: React.FC = () => {
  const [error, setError] = useState(null)
  const [disabled, setDisabled] = useState(true)
  const theme = useTheme()
  const [style, setStyle] = useState<{ style: Record<string, unknown> }>()

  const handleChange = async event => {
    // Listen for changes in the CardElement
    // display any errors as they type card details
    setDisabled(event.empty)
    setError(event.error ? event.error.message : '')
  }

  // css vars and `inherit` do not work here because of the iframe
  // so we need to get their computed values
  // we also cannot get the theme vars bc they are not stored on the documentElement can be nested
  useEffect(() => {
    const documentStyle = window.getComputedStyle(document.documentElement)

    const color = documentStyle.getPropertyValue(
      theme === 'dark' ? '--color-base-150' : '--color-base-750',
    )

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
            color: color,
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
          if (!disabled) handleChange(e)
        }}
        className={classes.element}
      />
    </div>
  )
}
