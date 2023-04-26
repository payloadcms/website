import React, { Fragment, useCallback, useEffect } from 'react'
import { v4 as uuid } from 'uuid'

import { CircleIconButton } from '@components/CircleIconButton'
import { CreditCardElement } from '@components/CreditCardElement'
import { useCustomer } from '@components/CreditCardSelector/useCustomer'
import { DropdownMenu } from '@components/DropdownMenu'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { Pill } from '@components/Pill'
import { Team } from '@root/payload-cloud-types'
import { usePaymentMethods } from './usePaymentMethods'

import classes from './index.module.scss'

type CreditCardListType = {
  team: Team
  customer: ReturnType<typeof useCustomer>['result']
  setDefaultPaymentMethod: ReturnType<typeof useCustomer>['setDefaultPaymentMethod']
  customerLoading: ReturnType<typeof useCustomer>['isLoading']
}

const List: React.FC<CreditCardListType> = props => {
  const { team, customer, setDefaultPaymentMethod, customerLoading } = props
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const newCardID = React.useRef<string>(`new-card-${uuid()}`)
  const [showNewCard, setShowNewCard] = React.useState(false)
  const hasInitialized = React.useRef(false)

  const {
    result: paymentMethods,
    error: paymentMethodsError,
    deletePaymentMethod,
    saveNewPaymentMethod,
    isLoading,
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
      }

      hasInitialized.current = true
    }
  }, [isLoading, scrollIntoView])

  useEffect(() => {
    const firstCard = paymentMethods?.[0]?.id
    newCardID.current = `new-card-${uuid()}`
    setShowNewCard(!firstCard)
  }, [paymentMethods, newCardID])

  const defaultPaymentMethod = customer?.invoice_settings?.default_payment_method

  return (
    <div className={classes.creditCardList}>
      <div ref={scrollRef} className={classes.scrollRef} />
      <div className={classes.formState}>
        {paymentMethodsError && <p className={classes.error}>{paymentMethodsError}</p>}
        {isLoading === 'deleting' && <p className={classes.deleting}>Deleting...</p>}
        {customerLoading && <p className={classes.loading}>Loading...</p>}
      </div>
      <div className={classes.cards}>
        {paymentMethods?.map((paymentMethod, index) => {
          const isDefault = defaultPaymentMethod === paymentMethod.id

          return (
            <div className={classes.card} key={index}>
              <div className={classes.cardBrand}>
                <div>{`${paymentMethod?.card?.brand} ending in ${paymentMethod?.card?.last4}`}</div>
                {isDefault && (
                  <div className={classes.default}>
                    <Pill text="Default" />
                  </div>
                )}
              </div>
              <DropdownMenu
                menu={
                  <Fragment>
                    <button
                      type="button"
                      className={classes.deleteCard}
                      onClick={() => {
                        deletePaymentMethod(paymentMethod.id)
                      }}
                      // do not allow the user to delete the last card
                      // only show the delete button if there are multiple cards
                      disabled={paymentMethods.length === 1}
                    >
                      Delete
                    </button>
                    {!isDefault && (
                      <button
                        type="button"
                        className={classes.makeDefault}
                        onClick={() => {
                          if (typeof setDefaultPaymentMethod === 'function')
                            setDefaultPaymentMethod(paymentMethod.id)
                        }}
                      >
                        Make default
                      </button>
                    )}
                  </Fragment>
                }
                className={classes.tooltipButton}
              />
            </div>
          )
        })}
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

// Need to first load the customer so we can know their default payment method
export const CreditCardList: React.FC<
  Omit<CreditCardListType, 'customer' | 'setDefaultPaymentMethod'>
> = props => {
  const { team } = props

  const {
    result: customer,
    error: customerError,
    setDefaultPaymentMethod,
    isLoading: customerLoading,
  } = useCustomer({
    stripeCustomerID: team.stripeCustomerID,
  })

  if (customer === null) {
    return <LoadingShimmer number={3} />
  }

  if (customerError) {
    return <Fragment>{customerError && <p className={classes.error}>{customerError}</p>}</Fragment>
  }

  return (
    <List
      {...props}
      customer={customer}
      setDefaultPaymentMethod={setDefaultPaymentMethod}
      customerLoading={customerLoading}
    />
  )
}
