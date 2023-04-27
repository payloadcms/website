import React, { Fragment, useEffect } from 'react'
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

  const {
    result: paymentMethods,
    error: paymentMethodsError,
    deletePaymentMethod,
    saveNewPaymentMethod,
    isLoading,
  } = usePaymentMethods({
    team,
  })

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
              {(paymentMethods.length > 1 || (paymentMethods.length === 1 && !isDefault)) && (
                // hide the menu if no items will appear in the list
                // i.e. if there is only one card, we are preventing it's deletion
                // but if it's not default, we still want to show the "make default" button
                <DropdownMenu
                  menu={
                    <Fragment>
                      {paymentMethods.length > 1 && (
                        // do not allow the user to delete the last card
                        // only show the delete button if there are multiple cards
                        <button
                          type="button"
                          className={classes.deleteCard}
                          disabled={paymentMethods.length === 1}
                          onClick={() => {
                            deletePaymentMethod(paymentMethod.id)
                          }}
                        >
                          Delete
                        </button>
                      )}
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
              )}
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
  Omit<CreditCardListType, 'customer' | 'setDefaultPaymentMethod' | 'customerLoading'>
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
