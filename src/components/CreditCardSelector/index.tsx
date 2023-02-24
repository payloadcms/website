import React, { useEffect } from 'react'

import { CreditCardElement } from '@components/CreditCardElement'
import { LargeRadio } from '@components/LargeRadio'
import { Team } from '@root/payload-cloud-types'

import classes from './index.module.scss'

export const CreditCardSelector: React.FC<{
  team: Team
  initialValue?: string
  onChange?: (value: string) => void // eslint-disable-line no-unused-vars
}> = props => {
  const { onChange, initialValue, team } = props
  const [error, setError] = React.useState<string | undefined>()
  const [cards, setCards] = React.useState([])
  const hasMadeRequest = React.useRef(false)
  // const prevValueFromProps = React.useRef(valueFromProps)
  const [internalState, setInternalState] = React.useState(initialValue)
  const [showNewCard, setShowNewCard] = React.useState(false)

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
          const newCards = res?.data?.data || []
          setCards(newCards)
          setShowNewCard(newCards.length === 0)
          setInternalState(newCards?.[0]?.id || 'new-card')
        } else {
          setError(res.message)
        }
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchPaymentMethods()
  }, [team])

  // allow external control of internal state
  // useEffect(() => {
  //   if (valueFromProps !== prevValueFromProps.current) setInternalState(valueFromProps)
  // }, [valueFromProps, internalState])

  useEffect(() => {
    if (typeof onChange === 'function') onChange(internalState)
  }, [onChange, internalState])

  return (
    <div className={classes.creditCardSelector}>
      {error && <p className={classes.error}>{error}</p>}
      {cards?.length === 0 && <p>No cards on file</p>}
      {cards?.map(card => (
        <LargeRadio
          key={card.id}
          value={card.id}
          checked={internalState === card.id}
          onChange={setInternalState}
          label={`${card.card.brand} ending in ${card.card.last4}`}
          name="card"
          id={card.id}
        />
      ))}
      <div>
        {showNewCard && (
          <LargeRadio
            value="new-card"
            checked={internalState === 'new-card'}
            onChange={setInternalState}
            label={<CreditCardElement />}
            name="card"
            id="new-card"
          />
        )}
        <button
          className={classes.addNew}
          onClick={() => {
            setShowNewCard(!showNewCard)
            setInternalState(showNewCard ? cards?.[0]?.id || 'new-card' : 'new-card')
          }}
          type="button"
        >
          {showNewCard ? 'Cancel new' : 'Add new card'}
        </button>
      </div>
    </div>
  )
}
