import React, { useState } from 'react'
import { CardElement as StripeCardElement } from '@stripe/react-stripe-js'

import classes from './index.module.scss'

export const CreditCardElement: React.FC = () => {
  const [error, setError] = useState(null)
  const [disabled, setDisabled] = useState(true)

  const handleChange = async event => {
    // Listen for changes in the CardElement
    // display any errors as they type card details
    setDisabled(event.empty)
    setError(event.error ? event.error.message : '')
  }

  const cardStyle = {
    // TODO: wire these into our theme
    // this is an iframe so css variables don't work
    style: {
      base: {
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: 'white',
        },
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  }

  return (
    <div>
      {error && <p className={classes.error}>{error}</p>}
      <StripeCardElement
        id="card-element"
        options={cardStyle}
        onChange={e => {
          if (!disabled) handleChange(e)
        }}
      />
    </div>
  )
}
