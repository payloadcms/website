import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'

import { CreditCardElement } from '@cloud/_components/CreditCardElement/index'
import { CircleIconButton } from '@components/CircleIconButton/index'
import { LargeRadio } from '@components/LargeRadio/index'
import { Pill } from '@components/Pill/index'
import { type PaymentMethod } from '@stripe/stripe-js'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { usePaymentMethods } from '../CreditCardList/usePaymentMethods'
import classes from './index.module.scss'

type CreditCardSelectorType = {
  enableInlineSave?: boolean
  initialPaymentMethods?: null | PaymentMethod[]
  initialValue?: string
  onChange?: (method?: string) => void
  onPaymentMethodChange?: (paymentMethod: string) => Promise<void>
  team: TeamWithCustomer
}

export const CreditCardSelector: React.FC<CreditCardSelectorType> = (props) => {
  const {
    enableInlineSave = true,
    initialPaymentMethods,
    initialValue,
    onChange,
    onPaymentMethodChange,
    team,
  } = props

  const customer = team?.stripeCustomer

  const newCardID = useRef<string>(`new-card-${uuid()}`)
  const [internalState, setInternalState] = useState(initialValue)
  const [showNewCard, setShowNewCard] = useState<boolean>(() => {
    return !initialValue && (!initialPaymentMethods || initialPaymentMethods?.length === 0)
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  const {
    defaultPaymentMethod,
    error,
    isLoading,
    result: paymentMethods,
    saveNewPaymentMethod,
  } = usePaymentMethods({
    initialValue: initialPaymentMethods,
    team,
  })

  const initializeState = useCallback(() => {
    if (paymentMethods) {
      if (!initialValue || !paymentMethods?.find((method) => method?.id === initialValue)) {
        // setShowNewCard(true)
        // to preselect the first card, do this instead:
        const firstCard = paymentMethods?.[0]?.id
        // if no card, show the new card option with a newly generated unique id prefixed with `new-card`
        // this will allow us to differentiate from a saved card in the checkout process
        setShowNewCard(!firstCard)
      } else {
        setShowNewCard(false)
        setInternalState(initialValue)
      }

      hasInitialized.current = true
    }
  }, [paymentMethods, initialValue])

  useEffect(() => {
    if (!initialValue && !hasInitialized.current) {
      initializeState()
    }
  }, [initializeState, initialValue])

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(internalState)
    }
  }, [onChange, internalState])

  // save the selected payment method to the subscription
  const handleChange = useCallback(
    async (incomingValue: string) => {
      if (!incomingValue?.startsWith('new-card') && typeof onPaymentMethodChange === 'function') {
        await onPaymentMethodChange(incomingValue)
      }
      setInternalState(incomingValue)
    },
    [onPaymentMethodChange],
  )

  // after saving a new card, auto select it
  // the `saveNewPaymentMethod` function will also update the team's default, if needed
  const handleSaveNewCard = useCallback(async () => {
    const setupIntent = await saveNewPaymentMethod(newCardID.current)

    const newPaymentMethod =
      typeof setupIntent?.payment_method === 'string'
        ? setupIntent?.payment_method
        : setupIntent?.payment_method?.id

    if (newPaymentMethod) {
      if (typeof onPaymentMethodChange === 'function') {
        await onPaymentMethodChange(newPaymentMethod)
      }
      setInternalState(newPaymentMethod)
      setShowNewCard(false)
    }
  }, [saveNewPaymentMethod, onPaymentMethodChange])

  return (
    <div className={classes.creditCardSelector}>
      <div className={classes.scrollRef} ref={scrollRef} />
      <div className={classes.formState}>{error && <p className={classes.error}>{error}</p>}</div>
      <div className={classes.cards}>
        {paymentMethods?.map((paymentMethod) => {
          const isDefault = defaultPaymentMethod === paymentMethod.id
          const isChecked = internalState === paymentMethod.id

          return (
            <div key={paymentMethod.id}>
              <LargeRadio
                checked={isChecked}
                id={paymentMethod.id}
                label={
                  <div className={classes.cardBrand}>
                    {`${paymentMethod?.card?.brand} ending in ${paymentMethod?.card?.last4} expires ${paymentMethod?.card?.exp_month}/${paymentMethod?.card?.exp_year}`}
                    {isDefault && (
                      <div className={classes.default}>
                        <Pill text="Default" />
                      </div>
                    )}
                  </div>
                }
                name="card"
                onChange={(incomingValue: string) => {
                  setShowNewCard(false)
                  handleChange(incomingValue)
                }}
                value={paymentMethod.id}
              />
              {defaultPaymentMethod && internalState !== defaultPaymentMethod && isChecked && (
                <p className={classes.notice}>
                  Your team's default payment method will be used if this payment method fails.
                </p>
              )}
            </div>
          )
        })}
        {showNewCard && (
          <LargeRadio
            checked={internalState === newCardID.current}
            id={newCardID.current}
            label={
              <CreditCardElement
                onChange={() => {
                  handleChange(newCardID.current)
                }}
              />
            }
            name="card"
            value={newCardID.current}
          />
        )}
      </div>
      {((showNewCard && enableInlineSave) || (paymentMethods && paymentMethods?.length > 0)) && (
        <div className={classes.controls}>
          {showNewCard && enableInlineSave && (
            <button className={classes.saveNewCard} onClick={handleSaveNewCard} type="button">
              {isLoading === 'saving' ? 'Saving...' : 'Save new card'}
            </button>
          )}
          {/* Only show the add/remove new card button if there are existing payment methods */}
          {paymentMethods && paymentMethods?.length > 0 && (
            <Fragment>
              {!showNewCard && (
                <CircleIconButton
                  icon="add"
                  label="Add new card"
                  onClick={() => {
                    setShowNewCard(true)
                    handleChange(newCardID.current)
                  }}
                />
              )}
              {showNewCard && (
                <button
                  className={classes.cancelNewCard}
                  onClick={() => {
                    setShowNewCard(false)
                    initializeState()
                  }}
                  type="button"
                >
                  Cancel new card
                </button>
              )}
            </Fragment>
          )}
        </div>
      )}
    </div>
  )
}
