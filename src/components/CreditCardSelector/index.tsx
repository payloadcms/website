import React, { Fragment, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'

import { CircleIconButton } from '@components/CircleIconButton'
import { CreditCardElement } from '@components/CreditCardElement'
import { LargeRadio } from '@components/LargeRadio'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { Pill } from '@components/Pill'
import { Team } from '@root/payload-cloud-types'
import useDebounce from '@root/utilities/use-debounce'
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
  updateSubscription: ReturnType<typeof useSubscription>['updateSubscription']
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
    updateSubscription,
  } = props

  const newCardID = React.useRef<string>(`new-card-${uuid()}`)
  const [internalState, setInternalState] = React.useState(initialValue)
  const [showNewCard, setShowNewCard] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const setToAfterRefresh = React.useRef<string | undefined>(undefined)

  const {
    result: paymentMethods,
    error,
    isLoading,
    saveNewPaymentMethod,
  } = usePaymentMethods({
    team,
  })

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

  const setSubscriptionPaymentMethod = React.useCallback(
    async selectedPaymentMethod => {
      if (typeof updateSubscription === 'function') {
        try {
          await updateSubscription({
            default_payment_method: selectedPaymentMethod,
          })
          toast.success('Payment method changed successfully')
        } catch (error) {
          console.error(error) // eslint-disable-line no-console
        }
      }
    },
    [updateSubscription],
  )

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(internalState)
    }
  }, [onChange, internalState])

  const handleChange = React.useCallback(
    async (incomingValue: string) => {
      await setSubscriptionPaymentMethod(incomingValue)
      setInternalState(incomingValue)
    },
    [setSubscriptionPaymentMethod],
  )

  const isNewCard = internalState === newCardID.current
  const defaultPaymentMethod = customer?.invoice_settings?.default_payment_method

  // don't show the loading messages unless it the requests take longer than 500ms
  const debouncedCustomerLoading = useDebounce(customerLoading, 500)

  return (
    <div className={classes.creditCardSelector}>
      {showTeamLink && (
        <p className={classes.description}>
          {`To manage your team's billing and payment information, go to your `}
          <Link href={`/cloud/${team.slug}/settings/billing`}>team billing page</Link>
          {`.`}
        </p>
      )}
      <div ref={scrollRef} className={classes.scrollRef} />
      <div className={classes.formState}>
        {error && <p className={classes.error}>{error}</p>}
        {debouncedCustomerLoading && <p className={classes.loading}>Loading...</p>}
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
            value={newCardID}
            checked={isNewCard}
            onChange={handleChange}
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
              saveNewPaymentMethod(newCardID.current)
            }}
          >
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
    </div>
  )
}

// Need to first load the customer so we can know their default payment method
// Optionally pass a subscription to load its default payment method as priority
export const CreditCardSelector: React.FC<
  Omit<CreditCardSelectorType, 'customer' | 'customerLoading' | 'updateSubscription'> & {
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

  const {
    result: subscription,
    error: subscriptionError,
    updateSubscription,
  } = useSubscription({
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
      updateSubscription={updateSubscription}
      initialValue={
        subscription?.default_payment_method || customer?.invoice_settings?.default_payment_method
      }
    />
  )
}
