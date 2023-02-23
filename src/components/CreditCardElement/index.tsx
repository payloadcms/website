import React, { useEffect, useState } from 'react'
import { CardElement as StripeCardElement } from '@stripe/react-stripe-js'

import { Plan } from '@root/payload-cloud-types'

export const CreditCardElement: React.FC<{
  selectedPlan: Plan
  onClientSecret: (clientSecret: string) => void // eslint-disable-line no-unused-vars
}> = props => {
  const { selectedPlan, onClientSecret } = props
  const [error, setError] = useState(null)
  const [disabled, setDisabled] = useState(true)
  const [clientSecret, setClientSecret] = useState('')
  const hasMadeRequest = React.useRef(false)

  useEffect(() => {
    if (hasMadeRequest.current) return
    hasMadeRequest.current = true

    if (selectedPlan) {
      const makePaymentIntent = async () => {
        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plan: selectedPlan?.id,
          }),
        })

        const res = await req.json()

        setClientSecret(res.clientSecret)
      }

      makePaymentIntent()
    }
  }, [selectedPlan])

  useEffect(() => {
    if (typeof onClientSecret === 'function') {
      onClientSecret(clientSecret)
    }
  }, [onClientSecret, clientSecret])

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
      {error && <div>{error}</div>}
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
