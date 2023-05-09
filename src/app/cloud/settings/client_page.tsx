'use client'

import React, { Fragment, useCallback } from 'react'
import { toast } from 'react-toastify'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { useModal } from '@faceless-ui/modal'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import FormProcessing from '@forms/FormProcessing'
import FormSubmissionError from '@forms/FormSubmissionError'
import Submit from '@forms/Submit'
import { OnSubmit } from '@forms/types'
import { useRouter } from 'next/navigation'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { Message } from '@components/Message'
import { ModalWindow } from '@components/ModalWindow'
import { useAuth } from '@root/providers/Auth'

import classes from './page.module.scss'

const modalSlug = 'delete-account'

const ModalContent = () => {
  const { closeModal } = useModal()
  const [hasEmail, setHasEmail] = React.useState(false)
  const [hasPW, setHasPW] = React.useState(false)

  return (
    <>
      <Heading marginTop={false} as="h5">
        Are you sure you want to delete your account?
      </Heading>
      <Message className={classes.warning} error={'Deleting your account cannot be undone.'} />
      <p>
        Team ownership will be transferred to another team member where possible. If no other team
        members exist, the team and associated projects / deployments will be
        <strong> permanently deleted</strong>.
      </p>
      <p>To proceed re-enter your account details below:</p>
      <Text
        className={classes.emailInput}
        label="Email"
        path="modalEmail"
        required
        onChange={value => {
          setHasEmail(Boolean(value))
        }}
      />
      <Text
        label="Password"
        path="modalPassword"
        type="password"
        required
        onChange={value => {
          setHasPW(Boolean(value))
        }}
      />
      <div className={classes.modalActions}>
        <Button label="cancel" appearance="secondary" onClick={() => closeModal(modalSlug)} />
        <Submit label="delete my account" appearance="danger" disabled={!(hasEmail && hasPW)} />
      </div>
    </>
  )
}

export const SettingsPage = () => {
  const { user, updateUser, login } = useAuth()
  const { openModal } = useModal()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [formToShow, setFormToShow] = React.useState<'account' | 'password'>('account')
  const [success, setSuccess] = React.useState<string | null>(null)
  const router = useRouter()

  const handleSubmit: OnSubmit = useCallback(
    async ({ data, dispatchFields }): Promise<void> => {
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 0)

      if (data?.password && data.password !== data.passwordConfirm) {
        dispatchFields({
          type: 'UPDATE',
          payload: [
            {
              path: 'passwordConfirm',
              errorMessage: 'Passwords do not match',
              valid: false,
              value: data.passwordConfirm,
            },
            {
              path: 'password',
              errorMessage: 'Passwords do not match',
              valid: false,
              value: data.password,
            },
          ],
        })

        return
      }

      try {
        await updateUser({
          name: data.name,
          email: data.email,
          password: data.password,
        })

        setSuccess('Your account has been updated')
      } catch (err) {
        const message = err?.message || `An error occurred while attempting to update your account`
        console.error(message) // eslint-disable-line no-console
        setSuccess(null)
        throw new Error(message)
      }
    },
    [updateUser],
  )

  const deleteAccount = React.useCallback(
    async ({ data }) => {
      if (user) {
        if (data.modalEmail !== user.email) {
          toast.error('Email provided does not match your account, please try again.')
          return undefined
        }

        try {
          const confirmedUser = await login({
            email: data.modalEmail as string,
            password: data.modalPassword as string,
          })

          if (confirmedUser && confirmedUser.id === user.id) {
            try {
              const req = await fetch(
                `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/${user.id}`,
                {
                  method: 'DELETE',
                  credentials: 'include',
                },
              )

              if (req.status === 200) {
                toast.success('Your account was successfully deleted.')
                router.push('/logout')
              }
            } catch (e) {
              toast.error('There was an issue deleting your account. Please try again.')
            }
          }
        } catch (e) {
          toast.error('Incorrect email or password.')
        }
      }
    },
    [login, router, user],
  )

  return (
    <Gutter className={classes.content}>
      <Heading marginTop={false} marginBottom={false} element="h1" as="h6">
        Account Settings
      </Heading>
      <Grid>
        <Cell cols={6} colsM={8}>
          <p>
            {formToShow === 'account' && (
              <Fragment>
                {'To change your password, '}
                <button
                  className={classes.viewButton}
                  type="button"
                  onClick={() => {
                    setFormToShow('password')
                  }}
                >
                  click here
                </button>
                {'.'}
              </Fragment>
            )}
            {formToShow === 'password' && (
              <Fragment>
                {'Change your password below. '}
                <button
                  className={classes.viewButton}
                  type="button"
                  onClick={() => {
                    setFormToShow('account')
                  }}
                >
                  Cancel
                </button>
                {'.'}
              </Fragment>
            )}
          </p>
          <Form
            className={classes.form}
            initialState={{
              name: {
                value: user?.name,
                initialValue: user?.name,
                errorMessage: 'Please enter a name',
              },
              email: {
                value: user?.email,
                valid: Boolean(user?.email),
                initialValue: user?.email,
                errorMessage: 'Please enter a valid email address',
              },
              password: {
                value: '',
                initialValue: undefined,
                errorMessage: 'Please enter a password',
              },
              passwordConfirm: {
                value: '',
                initialValue: undefined,
                errorMessage: 'Please confirm your password',
              },
            }}
            onSubmit={handleSubmit}
          >
            <Message success={success} />
            <FormSubmissionError />
            <FormProcessing message="Updating profile, one moment" />
            {formToShow === 'account' && (
              <>
                <Text path="name" label="Your Full Name" />
                <Text path="email" label="Email" required />
                <Text
                  value={user?.id}
                  label="User ID"
                  disabled
                  description="This is your user's ID within Payload"
                />
              </>
            )}
            {formToShow === 'password' && (
              <>
                <Text type="password" path="password" label="Password" />
                <Text type="password" path="passwordConfirm" label="Password Confirm" />
              </>
            )}
            <div className={classes.buttonWrap}>
              {formToShow === 'password' && (
                <Button
                  label="Cancel"
                  appearance="secondary"
                  onClick={() => {
                    setFormToShow('account')
                  }}
                />
              )}
              <div className={classes.buttonWrap}>
                <Submit label="Save" className={classes.submit} />
                <Button label="Log out" appearance="secondary" href="/logout" el="link" />
              </div>
            </div>
          </Form>
        </Cell>
      </Grid>
      <hr className={classes.hr} />
      <Heading element="h2" as="h6">
        Delete account
      </Heading>
      <p>Deleting your account is permanent and cannot be undone.</p>
      <Button
        className={classes.deleteAccount}
        label="Delete account"
        appearance="danger"
        onClick={() => {
          openModal(modalSlug)
        }}
      />
      <ModalWindow className={classes.modal} slug={modalSlug}>
        <Form onSubmit={deleteAccount}>
          <ModalContent />
        </Form>
      </ModalWindow>
    </Gutter>
  )
}
