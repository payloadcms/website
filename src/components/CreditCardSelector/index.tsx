import React, { useEffect } from 'react'
import { v4 as uuid } from 'uuid'

import { CircleIconButton } from '@components/CircleIconButton'
import { CreditCardElement } from '@components/CreditCardElement'
import { LargeRadio } from '@components/LargeRadio'
import { Team } from '@root/payload-cloud-types'
import { useGetPaymentMethods } from './useGetPaymentMethods'

import classes from './index.module.scss'

export const CreditCardSelector: React.FC<{
  team: Team
  initialValue?: string
  onChange?: (method?: string) => void // eslint-disable-line no-unused-vars
}> = props => {
  const { onChange, initialValue, team } = props
  const newCardID = React.useRef<string>(`new-card-${uuid()}`)
  const [internalState, setInternalState] = React.useState(initialValue || newCardID.current)
  const [showNewCard, setShowNewCard] = React.useState(false)

  const { result: paymentMethods, error } = useGetPaymentMethods({ team })

  // update the internal state when the payment methods change
  // preselect the first card if there is only one
  // generate a unique id for the new card, prefixed with `new-card`
  // this will allow us to differentiate from a saved card in the checkout process
  useEffect(() => {
    const firstCard = paymentMethods?.[0]?.id
    newCardID.current = `new-card-${uuid()}`
    setShowNewCard(!firstCard)
    setInternalState(firstCard || newCardID.current)
  }, [paymentMethods, newCardID])

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(internalState)
    }
  }, [onChange, internalState])

  const isNewCard = internalState === newCardID.current

  return (
    <div className={classes.creditCardSelector}>
      {error && <p className={classes.error}>{error}</p>}
      <div className={classes.cards}>
        {paymentMethods?.map(paymentMethod => (
          <LargeRadio
            key={paymentMethod.id}
            value={paymentMethod.id}
            checked={internalState === paymentMethod.id}
            onChange={setInternalState}
            label={`${paymentMethod?.card?.brand} ending in ${paymentMethod?.card?.last4}`}
            name="card"
            id={paymentMethod.id}
          />
        ))}
        {showNewCard && (
          <LargeRadio
            value={newCardID}
            checked={isNewCard}
            onChange={setInternalState}
            label={<CreditCardElement />}
            name="card"
            id={newCardID.current}
          />
        )}
      </div>
      {/* Only show the add/remove new card button if there are existing payment methods */}
      {paymentMethods?.length > 0 && (
        <div className={classes.newCardController}>
          <CircleIconButton
            onClick={() => {
              setShowNewCard(!showNewCard)
              setInternalState(
                showNewCard ? paymentMethods?.[0]?.id || newCardID.current : newCardID.current,
              )
            }}
            label={showNewCard ? 'Cancel new card' : 'Add new card'}
            icon={showNewCard ? 'close' : 'add'}
          />
        </div>
      )}
    </div>
  )
}
