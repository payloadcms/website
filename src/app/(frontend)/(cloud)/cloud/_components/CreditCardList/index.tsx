'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { CreditCardElement } from '@cloud/_components/CreditCardElement/index.js'
import { useModal } from '@faceless-ui/modal'
import { Elements } from '@stripe/react-stripe-js'
import type { PaymentMethod } from '@stripe/stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { v4 as uuid } from 'uuid'

import { Button } from '@components/Button/index.js'
import { CircleIconButton } from '@components/CircleIconButton/index.js'
import { DropdownMenu } from '@components/DropdownMenu/index.js'
import { Heading } from '@components/Heading/index.js'
import { ModalWindow } from '@components/ModalWindow/index.js'
import { Pill } from '@components/Pill/index.js'
import { usePaymentMethods } from './usePaymentMethods.js'

import classes from './index.module.scss'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const Stripe = loadStripe(apiKey)

type CreditCardListType = {
  team: TeamWithCustomer
  initialPaymentMethods?: PaymentMethod[] | null
}

const modalSlug = 'confirm-delete-payment-method'

const CardList: React.FC<CreditCardListType> = props => {
  const { team, initialPaymentMethods } = props
  const scrollRef = useRef<HTMLDivElement>(null)
  const newCardID = useRef<string>(`new-card-${uuid()}`)
  const [showNewCard, setShowNewCard] = useState(false)
  const paymentMethodToDelete = useRef<PaymentMethod | null>(null)
  const { closeModal, openModal } = useModal()

  const {
    result: paymentMethods,
    error: paymentMethodsError,
    deletePaymentMethod,
    saveNewPaymentMethod,
    isLoading,
    defaultPaymentMethod,
    setDefaultPaymentMethod,
  } = usePaymentMethods({
    team,
    initialValue: initialPaymentMethods,
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
      <div ref={scrollRef} className={classes.scrollRef} />
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
                    : `${paymentMethod?.card?.brand} ending in ${paymentMethod?.card?.last4}`}
                </div>
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
                        paymentMethodToDelete.current = paymentMethod
                        openModal(modalSlug)
                      }}
                    >
                      Delete
                    </button>
                    {!isDefault && (
                      <button
                        type="button"
                        className={classes.makeDefault}
                        onClick={() => {
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
          <Button
            appearance="primary"
            onClick={() => {
              saveNewPaymentMethod(newCardID.current)
            }}
            label={isLoading === 'saving' ? 'Saving...' : 'Save new card'}
          />
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
              <Button
                appearance="secondary"
                onClick={() => {
                  setShowNewCard(false)
                }}
                label={'Cancel'}
              />
            )}
          </Fragment>
        )}
      </div>
      <ModalWindow slug={modalSlug}>
        <div className={classes.modalContent}>
          <Heading marginTop={false} as="h4">
            {`You are about to delete `}
            <b>{`${paymentMethodToDelete?.current?.card?.brand}`}</b>
            {` ending in `}
            <b>{`${paymentMethodToDelete?.current?.card?.last4}`}</b>
            {`?`}
          </Heading>
          <p>Are you sure you want to do this? This action cannot be undone.</p>
          <div className={classes.modalActions}>
            <Button
              label="Cancel"
              appearance="secondary"
              onClick={() => {
                paymentMethodToDelete.current = null
                closeModal(modalSlug)
              }}
            />
            <Button
              label="Delete"
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

export const CreditCardList: React.FC<CreditCardListType> = props => {
  return (
    <Elements stripe={Stripe}>
      <CardList {...props} />
    </Elements>
  )
}
