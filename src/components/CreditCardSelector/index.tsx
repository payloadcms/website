import React, { useEffect } from 'react'

import { CircleIconButton } from '@components/CircleIconButton'
import { CreditCardElement } from '@components/CreditCardElement'
import { LargeRadio } from '@components/LargeRadio'
import { Team } from '@root/payload-cloud-types'
import { useGetPaymentMethods } from '@root/utilities/use-cloud-api'

import classes from './index.module.scss'

export const CreditCardSelector: React.FC<{
  team: Team
  initialValue?: string
  onChange?: (method?: string) => void // eslint-disable-line no-unused-vars
}> = props => {
  const { onChange, initialValue, team } = props
  const [internalState, setInternalState] = React.useState(initialValue)
  const [showNewCard, setShowNewCard] = React.useState(false)

  const { result: paymentMethods, error } = useGetPaymentMethods(team)

  useEffect(() => {
    setShowNewCard(!paymentMethods?.filter(paymentMethod => paymentMethod.id !== 'new-card').length)
    setInternalState(paymentMethods?.[0]?.id || 'new-card')
  }, [paymentMethods])

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(internalState)
    }
  }, [onChange, internalState])

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
            value="new-card"
            checked={internalState === 'new-card'}
            onChange={setInternalState}
            label={<CreditCardElement />}
            name="card"
            id="new-card"
          />
        )}
      </div>
      {paymentMethods?.filter(paymentMethod => paymentMethod.id !== 'new-card').length > 0 && (
        <div className={classes.addNew}>
          <CircleIconButton
            onClick={() => {
              setShowNewCard(!showNewCard)
              setInternalState(showNewCard ? paymentMethods?.[0]?.id || 'new-card' : 'new-card')
            }}
            label={showNewCard ? 'Cancel new card' : 'Add new card'}
          />
        </div>
      )}
    </div>
  )
}
