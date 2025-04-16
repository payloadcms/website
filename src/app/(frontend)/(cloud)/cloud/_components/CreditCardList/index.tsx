'use client'

import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import type { PaymentMethod } from '@stripe/stripe-js'

import { CreditCardElement } from '@cloud/_components/CreditCardElement/index'
import { Button } from '@components/Button/index'
import { CircleIconButton } from '@components/CircleIconButton/index'
import { DropdownMenu } from '@components/DropdownMenu/index'
import { Heading } from '@components/Heading/index'
import { ModalWindow } from '@components/ModalWindow/index'
import { Pill } from '@components/Pill/index'
import { useModal } from '@faceless-ui/modal'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

import classes from './index.module.scss'
import { usePaymentMethods } from './usePaymentMethods'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const Stripe = loadStripe(apiKey)

type CreditCardListType = {
  initialPaymentMethods?: null | PaymentMethod[]
  team: TeamWithCustomer
}

const modalSlug = 'confirm-delete-payment-method'

const CardList: React.FC<CreditCardListType> = (props) => {
  const { initialPaymentMethods, team } = props
  const scrollRef = useRef<HTMLDivElement>(null)
  const newCardID = useRef<string>(`new-card-${uuid()}`)
  const [showNewCard, setShowNewCard] = useState(false)
  const paymentMethodToDelete = useRef<null | PaymentMethod>(null)
  const { closeModal, openModal } = useModal()

  const {
    defaultPaymentMethod,
    deletePaymentMethod,
    error: paymentMethodsError,
    isLoading,
    result: paymentMethods,
    saveNewPaymentMethod,
    setDefaultPaymentMethod,
  } = usePaymentMethods({
    initialValue: initialPaymentMethods,
    team,
  })

  useEffect(() => {
    if (paymentMethods) {
      const firstCard = paymentMethods?.[0]?.id
      newCardID.current = `new-card-${uuid()}`
      setShowNewCard(!firstCard)
    }
  }, [paymentMethods, newCardID])

  return (
    <div className={classes.creditCardList}>
      <div className={classes.scrollRef} ref={scrollRef} />
      <div className={classes.formState}>
        {paymentMethodsError && <p className={classes.error}>{paymentMethodsError}</p>}
      </div>
      <div className={classes.cards}>
        {paymentMethods?.map((paymentMethod, index) => {
          const isDefault = defaultPaymentMethod === paymentMethod.id
          const isDeleting = paymentMethodToDelete.current?.id === paymentMethod.id

          return (
            <div
              className={[classes.card, isDeleting && classes.isDeleting].filter(Boolean).join(' ')}
              key={index}
            >
              <div className={classes.cardBrand}>
                <div>
                  {isDeleting
                    ? 'Deleting...'
                    : `${paymentMethod?.card?.brand} ending in ${paymentMethod?.card?.last4} exp ${paymentMethod?.card?.exp_month}/${paymentMethod?.card?.exp_year}`}
                </div>
                {isDefault && (
                  <div className={classes.default}>
                    <Pill text="Default" />
                  </div>
                )}
              </div>
              <DropdownMenu
                className={classes.tooltipButton}
                menu={
                  <Fragment>
                    <button
                      className={classes.deleteCard}
                      onClick={() => {
                        paymentMethodToDelete.current = paymentMethod
                        openModal(modalSlug)
                      }}
                      type="button"
                    >
                      Delete
                    </button>
                    {!isDefault && (
                      <button
                        className={classes.makeDefault}
                        onClick={() => {
                          setDefaultPaymentMethod(paymentMethod.id)
                        }}
                        type="button"
                      >
                        Make default
                      </button>
                    )}
                  </Fragment>
                }
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
          <Button
            appearance="primary"
            label={isLoading === 'saving' ? 'Saving...' : 'Save new card'}
            onClick={() => {
              saveNewPaymentMethod(newCardID.current)
            }}
          />
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
                }}
              />
            )}
            {showNewCard && (
              <Button
                appearance="secondary"
                label={'Cancel'}
                onClick={() => {
                  setShowNewCard(false)
                }}
              />
            )}
          </Fragment>
        )}
      </div>
      <ModalWindow slug={modalSlug}>
        <div className={classes.modalContent}>
          <Heading as="h4" marginTop={false}>
            {`You are about to delete `}
            <b>{`${paymentMethodToDelete?.current?.card?.brand}`}</b>
            {` ending in `}
            <b>{`${paymentMethodToDelete?.current?.card?.last4}`}</b>
            {` exp `}
            <b>
              {`${paymentMethodToDelete?.current?.card?.exp_month}/${paymentMethodToDelete?.current?.card?.exp_year}`}
            </b>
            {`?`}
          </Heading>
          <p>Are you sure you want to do this? This action cannot be undone.</p>
          <div className={classes.modalActions}>
            <Button
              appearance="secondary"
              label="Cancel"
              onClick={() => {
                paymentMethodToDelete.current = null
                closeModal(modalSlug)
              }}
            />
            <Button
              appearance="danger"
              label="Delete"
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

export const CreditCardList: React.FC<CreditCardListType> = (props) => {
  return (
    <Elements stripe={Stripe}>
      <CardList {...props} />
    </Elements>
  )
}
