import React, { Fragment, useCallback, useEffect, useRef } from 'react'
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
  customer: ReturnType<typeof useCustomer>['result']
  customerLoading: ReturnType<typeof useCustomer>['isLoading']
  onPaymentMethodChange: (paymentMethod: string) => Promise<void>
  defaultPaymentMethod?: string
}

const Selector: React.FC<CreditCardSelectorType> = props => {
  const {
    onChange,
    initialValue,
    team,
    enableInlineSave = true,
    customer,
    customerLoading,
    onPaymentMethodChange,
    defaultPaymentMethod,
  } = props

  const newCardID = React.useRef<string>(`new-card-${uuid()}`)
  const [internalState, setInternalState] = React.useState(initialValue)
  const [showNewCard, setShowNewCard] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

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
  const initializeState = useCallback(() => {
    if (paymentMethods) {
      if (!initialValue || !paymentMethods?.find(method => method?.id === initialValue)) {
        const firstCard = paymentMethods?.[0]?.id
        newCardID.current = `new-card-${uuid()}`
        setShowNewCard(!firstCard)
        setInternalState(firstCard || newCardID.current)
      } else {
        setShowNewCard(false)
        setInternalState(initialValue)
      }

      hasInitialized.current = true
    }
  }, [paymentMethods, newCardID, initialValue])

  useEffect(() => {
    if (!hasInitialized.current) {
      initializeState()
    }
  }, [initializeState])

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(internalState)
    }
  }, [onChange, internalState])

  // save the selected payment method to the subscription
  const handleChange = React.useCallback(
    async (incomingValue: string) => {
      if (!incomingValue?.startsWith('new-card')) {
        await onPaymentMethodChange(incomingValue)
      }
      setInternalState(incomingValue)
    },
    [onPaymentMethodChange],
  )

  // after saving a new card, auto select it
  const handleSaveNewCard = useCallback(async () => {
    const setupIntent = await saveNewPaymentMethod(newCardID.current)
    const newPaymentMethod =
      typeof setupIntent?.setupIntent?.payment_method === 'string'
        ? setupIntent?.setupIntent?.payment_method
        : setupIntent?.setupIntent?.payment_method?.id

    if (newPaymentMethod) {
      await onPaymentMethodChange(newPaymentMethod)
      setInternalState(newPaymentMethod)
      setShowNewCard(false)
    }
  }, [saveNewPaymentMethod, onPaymentMethodChange])

  const isNewCard = internalState === newCardID.current

  // don't show the loading messages unless it the requests take longer than 500ms
  const debouncedCustomerLoading = useDebounce(customerLoading, 500)

  return (
    <div className={classes.creditCardSelector}>
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
      {(showNewCard && enableInlineSave) ||
        (paymentMethods && paymentMethods?.length > 0 && (
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
        ))}
    </div>
  )
}

// Need to first load the customer so we can know their default payment method
// Optionally pass a subscription to load its default payment method as priority
export const CreditCardSelector: React.FC<
  Omit<CreditCardSelectorType, 'customer' | 'customerLoading' | 'onPaymentMethodChange'> & {
    // if one is provided, we'll use it to fetch the subscription
    // will also be used to update the subscription when a new card is saved
    // or when a different card is selected
    stripeSubscriptionID?: string
  }
> = props => {
  const { team, stripeSubscriptionID } = props

  const {
    result: customer,
    error: customerError,
    isLoading: customerLoading,
  } = useCustomer({
    team,
  })

  const {
    result: subscription,
    error: subscriptionError,
    updateSubscription,
  } = useSubscription({
    team,
    stripeSubscriptionID,
  })

  const onSubscriptionChange = useCallback(
    async (newPaymentMethod: string) => {
      if (stripeSubscriptionID) {
        try {
          await updateSubscription({
            default_payment_method: newPaymentMethod,
          })
          toast.success('Payment method updated')
        } catch (error) {
          console.error(error) // eslint-disable-line no-console
          toast.error('Error updating payment method')
        }
      }
    },
    [stripeSubscriptionID, updateSubscription],
  )

  if (customerError || (stripeSubscriptionID && subscriptionError)) {
    return (
      <Fragment>
        {customerError && <p className={classes.error}>{customerError}</p>}
        {subscriptionError && <p className={classes.error}>{subscriptionError}</p>}
      </Fragment>
    )
  }

  if (customer === null || (stripeSubscriptionID && subscription === null)) {
    return <LoadingShimmer number={3} />
  }

  const defaultPaymentMethod = customer
    ? typeof customer?.invoice_settings?.default_payment_method === 'object'
      ? customer?.invoice_settings?.default_payment_method?.id
      : customer?.invoice_settings?.default_payment_method
    : undefined

  return (
    <Selector
      {...props}
      customer={customer}
      customerLoading={customerLoading}
      onPaymentMethodChange={onSubscriptionChange}
      defaultPaymentMethod={defaultPaymentMethod}
      initialValue={subscription?.default_payment_method || defaultPaymentMethod}
    />
  )
}
