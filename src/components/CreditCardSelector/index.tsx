import React, { useEffect } from 'react'

import { CreditCardElement } from '@components/CreditCardElement'
import { LargeRadio } from '@components/LargeRadio'
import { Plan, Team } from '@root/payload-cloud-types'

export const CreditCardSelector: React.FC<{
  team: Team
  value?: string
  onChange?: (value: string) => void // eslint-disable-line no-unused-vars
  onClientSecret?: (clientSecret: string) => void // eslint-disable-line no-unused-vars
  selectedPlan?: Plan
}> = props => {
  const { onChange, value: valueFromProps, team, onClientSecret, selectedPlan } = props
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

        // setCards(paymentMethods)
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchPaymentMethods()
  }, [team])

  return (
    <div>
      {error && <div>{error}</div>}
      {cards?.length === 0 && <div>No cards on file</div>}
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
      <CreditCardElement onClientSecret={onClientSecret} selectedPlan={selectedPlan} />
    </div>
  )
}
