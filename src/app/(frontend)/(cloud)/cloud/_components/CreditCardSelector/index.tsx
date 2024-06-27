import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { CreditCardElement } from '@cloud/_components/CreditCardElement/index.js'
import { type PaymentMethod } from '@stripe/stripe-js'
import { v4 as uuid } from 'uuid'

import { CircleIconButton } from '@components/CircleIconButton/index.js'
import { LargeRadio } from '@components/LargeRadio/index.js'
import { Pill } from '@components/Pill/index.js'
import { usePaymentMethods } from '../CreditCardList/usePaymentMethods.js'

import classes from './index.module.scss'

type CreditCardSelectorType = {
  team: TeamWithCustomer
  initialValue?: string
  onChange?: (method?: string) => void // eslint-disable-line no-unused-vars
  enableInlineSave?: boolean
  onPaymentMethodChange?: (paymentMethod: string) => Promise<void>
  initialPaymentMethods?: PaymentMethod[] | null
}

export const CreditCardSelector: React.FC<CreditCardSelectorType> = props => {
  const {
    onChange,
    initialValue,
    initialPaymentMethods,
    team,
    enableInlineSave = true,
    onPaymentMethodChange,
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
    result: paymentMethods,
    error,
    isLoading,
    saveNewPaymentMethod,
    defaultPaymentMethod,
  } = usePaymentMethods({
    team,
    initialValue: initialPaymentMethods,
  })

  const initializeState = useCallback(() => {
    if (paymentMethods) {
      if (!initialValue || !paymentMethods?.find(method => method?.id === initialValue)) {
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
      <div ref={scrollRef} className={classes.scrollRef} />
      <div className={classes.formState}>{error && <p className={classes.error}>{error}</p>}</div>
      <div className={classes.cards}>
        {paymentMethods?.map(paymentMethod => {
          const isDefault = defaultPaymentMethod === paymentMethod.id
          const isChecked = internalState === paymentMethod.id

          return (
            <div key={paymentMethod.id}>
              <LargeRadio
                value={paymentMethod.id}
                checked={isChecked}
                onChange={(incomingValue: string) => {
                  setShowNewCard(false)
                  handleChange(incomingValue)
                }}
                label={
                  <div className={classes.cardBrand}>
                    {`${paymentMethod?.card?.brand} ending in ${paymentMethod?.card?.last4}`}
                    {isDefault && (
                      <div className={classes.default}>
                        <Pill text="Default" />
                      </div>
                    )}
                  </div>
                }
                name="card"
                id={paymentMethod.id}
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
            value={newCardID.current}
            checked={internalState === newCardID.current}
            label={
              <CreditCardElement
                onChange={() => {
                  handleChange(newCardID.current)
                }}
              />
            }
            name="card"
            id={newCardID.current}
          />
        )}
      </div>
      {((showNewCard && enableInlineSave) || (paymentMethods && paymentMethods?.length > 0)) && (
        <div className={classes.controls}>
          {showNewCard && enableInlineSave && (
            <button type="button" className={classes.saveNewCard} onClick={handleSaveNewCard}>
              {isLoading === 'saving' ? 'Saving...' : 'Save new card'}
            </button>
          )}
          {/* Only show the add/remove new card button if there are existing payment methods */}
          {paymentMethods && paymentMethods?.length > 0 && (
            <Fragment>
              {!showNewCard && (
                <CircleIconButton
                  onClick={() => {
                    setShowNewCard(true)
                    handleChange(newCardID.current)
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
                    initializeState()
                  }}
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
