import React, { Fragment, useEffect } from 'react'
import { useModal } from '@faceless-ui/modal'
import type { PaymentMethod } from '@stripe/stripe-js'
import { v4 as uuid } from 'uuid'

import { Button } from '@components/Button'
import { CircleIconButton } from '@components/CircleIconButton'
import { CreditCardElement } from '@components/CreditCardElement'
import { useCustomer } from '@components/CreditCardSelector/useCustomer'
import { DropdownMenu } from '@components/DropdownMenu'
import { Heading } from '@components/Heading'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { ModalWindow } from '@components/ModalWindow'
import { Pill } from '@components/Pill'
import { Team } from '@root/payload-cloud-types'
import useDebounce from '@root/utilities/use-debounce'
import { usePaymentMethods } from './usePaymentMethods'

import classes from './index.module.scss'

type CreditCardListType = {
  team: Team
  customer: ReturnType<typeof useCustomer>['result']
  setDefaultPaymentMethod: ReturnType<typeof useCustomer>['setDefaultPaymentMethod']
  customerLoading: ReturnType<typeof useCustomer>['isLoading']
}

const modalSlug = 'confirm-delete-payment-method'

const List: React.FC<CreditCardListType> = props => {
  const { team, customer, setDefaultPaymentMethod, customerLoading } = props
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const newCardID = React.useRef<string>(`new-card-${uuid()}`)
  const [showNewCard, setShowNewCard] = React.useState(false)
  const paymentMethodToDelete = React.useRef<PaymentMethod | null>(null)
  const { closeModal, openModal } = useModal()

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
    if (paymentMethods) {
      const firstCard = paymentMethods?.[0]?.id
      newCardID.current = `new-card-${uuid()}`
      setShowNewCard(!firstCard)
    }
  }, [paymentMethods, newCardID])

  const defaultPaymentMethod = customer
    ? typeof customer?.invoice_settings?.default_payment_method === 'object'
      ? customer?.invoice_settings?.default_payment_method?.id
      : customer?.invoice_settings?.default_payment_method
    : undefined

  // don't show the loading messages unless it the requests take longer than 500ms
  const debouncedLoadingPaymentMethods = useDebounce(isLoading, 500)
  const debouncedCustomerLoading = useDebounce(customerLoading, 500)

  return (
    <div className={classes.creditCardList}>
      <div ref={scrollRef} className={classes.scrollRef} />
      <div className={classes.formState}>
        {paymentMethodsError && <p className={classes.error}>{paymentMethodsError}</p>}
        {debouncedLoadingPaymentMethods === 'deleting' && (
          <p className={classes.deleting}>Deleting card...</p>
        )}
        {debouncedCustomerLoading && <p className={classes.loading}>Loading...</p>}
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
              {paymentMethods.length > 1 && !isDefault && (
                // hide the menu if it is the only card or the default card
                // the user has to make another card the default before they can delete the current default
                <DropdownMenu
                  menu={
                    <Fragment>
                      <button
                        type="button"
                        className={classes.deleteCard}
                        disabled={paymentMethods.length === 1}
                        onClick={() => {
                          paymentMethodToDelete.current = paymentMethod
                          openModal(modalSlug)
                        }}
                      >
                        Delete
                      </button>
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
      <ModalWindow slug={modalSlug}>
        <div className={classes.modalContent}>
          <Heading marginTop={false} as="h5">
            {`You are about to delete `}
            <b>{`${paymentMethodToDelete?.current?.card?.brand}`}</b>
            {` ending in `}
            <b>{`${paymentMethodToDelete?.current?.card?.last4}`}</b>
            {`?`}
          </Heading>
          <p>Are you sure you want to do this? This action cannot be undone.</p>
          <div className={classes.modalActions}>
            <Button
              label="cancel"
              appearance="secondary"
              onClick={() => {
                paymentMethodToDelete.current = null
                closeModal(modalSlug)
              }}
            />
            <Button
              label="delete"
              appearance="danger"
              onClick={() => {
                if (paymentMethodToDelete.current) {
                  deletePaymentMethod(paymentMethodToDelete?.current?.id)
                  closeModal(modalSlug)
                }
              }}
            />
          </div>
        </div>
      </ModalWindow>
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
    team,
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
