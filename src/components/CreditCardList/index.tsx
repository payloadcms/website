import React, { Fragment, useCallback, useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid'

import { CircleIconButton } from '@components/CircleIconButton'
import { CreditCardElement } from '@components/CreditCardElement'
import { useConfirmCardSetup } from '@root/app/new/(checkout)/useConfirmCardSetup'
import { Team } from '@root/payload-cloud-types'
import { useGetPaymentMethods } from '../CreditCardSelector/useGetPaymentMethods'

import classes from './index.module.scss'

export const CreditCardList: React.FC<{
  team: Team
}> = props => {
  const { team } = props
  const newCardID = React.useRef<string>(`new-card-${uuid()}`)
  const [showNewCard, setShowNewCard] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState('')
  const isRequesting = useRef(false)

  const {
    result: paymentMethods,
    error: paymentMethodsError,
    refreshPaymentMethods,
  } = useGetPaymentMethods({ team })

  const confirmCardSetup = useConfirmCardSetup({
    team,
  })

  useEffect(() => {
    const firstCard = paymentMethods?.[0]?.id
    newCardID.current = `new-card-${uuid()}`
    setShowNewCard(!firstCard)
  }, [paymentMethods, newCardID])

  const handleSaveNewCard = useCallback(async () => {
    if (isRequesting.current) {
      return
    }

    isRequesting.current = true
    setError(undefined)
    setLoading(true)

    try {
      await confirmCardSetup(newCardID.current)
      await refreshPaymentMethods()
      setLoading(false)
      setSuccess('New card saved')
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }

    isRequesting.current = false
  }, [confirmCardSetup, refreshPaymentMethods])

  return (
    <div className={classes.creditCardSelector}>
      {paymentMethodsError && (
        <div className={classes.formState}>
          {paymentMethodsError && <p className={classes.error}>{paymentMethodsError}</p>}
        </div>
      )}
      <div className={classes.cards}>
        {paymentMethods?.map((paymentMethod, index) => (
          <div className={classes.card} key={index}>
            <p>{`${paymentMethod?.card?.brand} ending in ${paymentMethod?.card?.last4}`}</p>
          </div>
        ))}
        {showNewCard && (
          <div className={classes.newCardWrapper}>
            {(error || loading || success) && (
              <div className={classes.cardState}>
                {error && <p className={classes.error}>{error}</p>}
                {success && <p className={classes.success}>{success}</p>}
                {loading && <p className={classes.loading}>Saving new card...</p>}
              </div>
            )}
            <div className={classes.card}>
              <CreditCardElement />
            </div>
          </div>
        )}
      </div>
      <div className={classes.controls}>
        {showNewCard && (
          <button type="button" onClick={handleSaveNewCard} className={classes.saveNewCard}>
            Save new card
          </button>
        )}
        {/* Only show the add/remove new card button if there are existing payment methods */}
        {paymentMethods?.length > 0 && (
          <Fragment>
            {!showNewCard && (
              <CircleIconButton
                onClick={() => {
                  setShowNewCard(true)
                }}
                label="Add new card"
                icon="add"
              />
            )}
            {showNewCard && (
              <button
                type="button"
                className={classes.cancelNewCard}
                onClick={() => {
                  setShowNewCard(false)
                }}
              >
                Cancel
              </button>
            )}
          </Fragment>
        )}
      </div>
    </div>
  )
}
