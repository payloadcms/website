import React, { useEffect } from 'react'

import { CreditCardElement } from '@components/CreditCardElement'
import { LargeRadio } from '@components/LargeRadio'
import { Team } from '@root/payload-cloud-types'

import classes from './index.module.scss'

export const CreditCardSelector: React.FC<{
  team: Team
  value?: string
  onChange?: (value: string) => void // eslint-disable-line no-unused-vars
}> = props => {
  const { onChange, value: valueFromProps, team } = props
  const [error, setError] = React.useState<string | undefined>()
  const [cards, setCards] = React.useState([])
  const hasMadeRequest = React.useRef(false)

  useEffect(() => {
    if (hasMadeRequest.current) return
    hasMadeRequest.current = true

    const fetchPaymentMethods = async () => {
      try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/stripe/rest`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stripeMethod: 'customers.listPaymentMethods',
            stripeArgs: [
              team.stripeCustomerID,
              {
                type: 'card',
              },
            ],
          }),
        })

        const res = await req.json()

        if (req.ok) {
          setCards(res?.data?.data || [])
        } else {
          setError(res.message)
        }
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchPaymentMethods()
  }, [team])

  return (
    <div>
      {error && <p className={classes.error}>{error}</p>}
      {cards?.length === 0 && <p>No cards on file</p>}
      {cards?.map(card => (
        <LargeRadio
          key={card.id}
          value={card.id}
          checked={valueFromProps === card.id}
          onChange={onChange}
          label={card.card.brand}
          name="card"
          id={card.id}
        />
      ))}
      <CreditCardElement />
    </div>
  )
}
