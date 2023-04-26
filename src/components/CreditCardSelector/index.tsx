import React, { Fragment, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'

import { CircleIconButton } from '@components/CircleIconButton'
import { CreditCardElement } from '@components/CreditCardElement'
import { LargeRadio } from '@components/LargeRadio'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { Pill } from '@components/Pill'
import { Team } from '@root/payload-cloud-types'
import { usePaymentMethods } from '../CreditCardList/usePaymentMethods'
import { useCustomer } from './useCustomer'
import { useSubscription } from './useSubscription'

import classes from './index.module.scss'

type CreditCardSelectorType = {
  team: Team
  initialValue?: string
  onChange?: (method?: string) => void // eslint-disable-line no-unused-vars
  enableInlineSave?: boolean
  showTeamLink?: boolean
  customer: ReturnType<typeof useCustomer>['result']
  customerLoading: ReturnType<typeof useCustomer>['isLoading']
}

const Selector: React.FC<CreditCardSelectorType> = props => {
  const {
    onChange,
    initialValue,
    team,
    enableInlineSave = true,
    customer,
    showTeamLink = true,
    customerLoading,
  } = props

  const newCardID = React.useRef<string>(`new-card-${uuid()}`)
  const [internalState, setInternalState] = React.useState(initialValue)
  const [showNewCard, setShowNewCard] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const setToAfterRefresh = React.useRef<string | undefined>(undefined)
  const hasInitialized = React.useRef(false)

  const {
    result: paymentMethods,
    error,
    isLoading,
    saveNewPaymentMethod,
  } = usePaymentMethods({
    team,
  })

  const scrollIntoView = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }, 0)
  }, [scrollRef])

  // scroll into view each time the payment methods change but not on first load
  // i.e. adding or deleting cards, refreshing the list, etc
  useEffect(() => {
    if (isLoading) {
      if (hasInitialized.current) {
        scrollIntoView()

        if (setToAfterRefresh.current) {
          setInternalState(setToAfterRefresh.current)
          setToAfterRefresh.current = undefined
        }
      }

      hasInitialized.current = true
    }
  }, [isLoading, scrollIntoView])

  // if the initial value is unset or invalid, preselect the first card if possible
  // otherwise show the new card option with a newly generated unique id, prefixed with `new-card`
  // this will allow us to differentiate from a saved card in the checkout process
  // this is a callback so it can be used on mount and also on new card cancel
  const initializeState = useCallback(() => {
    if (
      paymentMethods &&
      (!initialValue || !paymentMethods?.find(method => method?.id === initialValue))
    ) {
      const firstCard = paymentMethods?.[0]?.id
      newCardID.current = `new-card-${uuid()}`
      setShowNewCard(!firstCard)
      setInternalState(firstCard || newCardID.current)
    } else {
      setShowNewCard(false)
      setInternalState(initialValue)
    }
  }, [paymentMethods, newCardID, initialValue])

  useEffect(() => {
    initializeState()
  }, [initializeState])

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(internalState)
    }
  }, [onChange, internalState])

  const isNewCard = internalState === newCardID.current
  const defaultPaymentMethod = customer?.invoice_settings?.default_payment_method

  return (
    <div className={classes.creditCardSelector}>
      {showTeamLink && (
        <p className={classes.description}>
          {`To manage your team's billing and payment information, go to your `}
          <Link href={`/cloud/${team.slug}/billing`}>team billing page</Link>
          {`.`}
        </p>
      )}
      <div ref={scrollRef} className={classes.scrollRef} />
      <div className={classes.formState}>
        {isLoading === 'saving' && <p className={classes.loading}>Saving...</p>}
        {error && <p className={classes.error}>{error}</p>}
        {customerLoading && <p className={classes.loading}>Loading...</p>}
      </div>
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
                  setInternalState(incomingValue)
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
            value={newCardID}
            checked={isNewCard}
            onChange={setInternalState}
            label={<CreditCardElement />}
            name="card"
            id={newCardID.current}
          />
        )}
      </div>
      <div className={classes.controls}>
        {showNewCard && enableInlineSave && (
          <button
            type="button"
            className={classes.saveNewCard}
            onClick={() => {
              setToAfterRefresh.current = newCardID.current
              scrollIntoView()
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
                  setInternalState(newCardID.current)
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
    </div>
  )
}

// Need to first load the customer so we can know their default payment method
// Optionally pass a subscription to load its default payment method as priority
export const CreditCardSelector: React.FC<
  Omit<CreditCardSelectorType, 'customer' | 'customerLoading'> & {
    stripeSubscriptionID?: string
  }
> = props => {
  const { team, stripeSubscriptionID } = props

  const {
    result: customer,
    error: customerError,
    isLoading: customerLoading,
  } = useCustomer({
    stripeCustomerID: team.stripeCustomerID,
  })

  const { result: subscription, error: subscriptionError } = useSubscription({
    stripeSubscriptionID,
  })

  if (customer === null || (stripeSubscriptionID && subscription === null)) {
    return <LoadingShimmer number={3} />
  }

  if (customerError || (stripeSubscriptionID && subscriptionError)) {
    return (
      <Fragment>
        {customerError && <p className={classes.error}>{customerError}</p>}
        {subscriptionError && <p className={classes.error}>{subscriptionError}</p>}
      </Fragment>
    )
  }

  return (
    <Selector
      {...props}
      customer={customer}
      customerLoading={customerLoading}
      initialValue={
        subscription?.default_payment_method || customer?.invoice_settings?.default_payment_method
      }
    />
  )
}
