import React, { Fragment, useCallback, useEffect } from 'react'
import { v4 as uuid } from 'uuid'

import { CircleIconButton } from '@components/CircleIconButton'
import { CreditCardElement } from '@components/CreditCardElement'
import { TrashIcon } from '@root/icons/TrashIcon'
import { Team } from '@root/payload-cloud-types'
import { usePaymentMethods } from './usePaymentMethods'

import classes from './index.module.scss'

export const CreditCardList: React.FC<{
  team: Team
}> = props => {
  const { team } = props
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const newCardID = React.useRef<string>(`new-card-${uuid()}`)
  const [showNewCard, setShowNewCard] = React.useState(false)

  const {
    result: paymentMethods,
    error: paymentMethodsError,
    deletePaymentMethod,
    saveNewPaymentMethod,
    isLoading: isLoading,
  } = usePaymentMethods({
    team,
  })

  useEffect(() => {
    const firstCard = paymentMethods?.[0]?.id
    newCardID.current = `new-card-${uuid()}`
    setShowNewCard(!firstCard)
  }, [paymentMethods, newCardID])

  return (
    <div className={classes.creditCardList}>
      <div ref={scrollRef} className={classes.scrollRef} />
      <div className={classes.formState}>
        {paymentMethodsError && <p className={classes.error}>{paymentMethodsError}</p>}
        {isLoading && <p className={classes.loading}>Saving card...</p>}
      </div>
      <div className={classes.cards}>
        {paymentMethods?.map((paymentMethod, index) => (
          <div className={classes.card} key={index}>
            <p className={classes.cardBrand}>
              {`${paymentMethod?.card?.brand} ending in ${paymentMethod?.card?.last4}`}
            </p>
            {paymentMethods.length > 1 && (
              // do not allow the user to delete the last card
              // only show the delete button if there are multiple cards
              <button
                type="button"
                className={classes.deleteCard}
                onClick={() => {
                  deletePaymentMethod(paymentMethod.id)
                }}
              >
                <TrashIcon />
              </button>
            )}
          </div>
        ))}
        {showNewCard && (
          <div className={classes.newCard}>
            <CreditCardElement />
          </div>
        )}
      </div>
      <div className={classes.controls}>
        {showNewCard && (
          <button
            type="button"
            className={classes.saveNewCard}
            onClick={() => {
              saveNewPaymentMethod(newCardID.current)
            }}
          >
            Save new card
          </button>
        )}
        {/* Only show the add/remove new card button if there are existing payment methods */}
        {paymentMethods && paymentMethods?.length > 0 && (
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
