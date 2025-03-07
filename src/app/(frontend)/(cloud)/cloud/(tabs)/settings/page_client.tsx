'use client'

import type { OnSubmit } from '@forms/types'
import type { User } from '@root/payload-cloud-types'

import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader/index'
import { revalidateCache } from '@cloud/_actions/revalidateCache'
import { Button } from '@components/Button/index'
import { Heading } from '@components/Heading/index'
import { HR } from '@components/HR/index'
import { ModalWindow } from '@components/ModalWindow/index'
import { useModal } from '@faceless-ui/modal'
import { Text } from '@forms/fields/Text/index'
import Form from '@forms/Form/index'
import FormProcessing from '@forms/FormProcessing/index'
import FormSubmissionError from '@forms/FormSubmissionError/index'
import Submit from '@forms/Submit/index'
import { useAuth } from '@root/providers/Auth/index'
import React, { Fragment, useCallback } from 'react'
import { toast } from 'sonner'

import { DeletionConfirmationForm } from './DeletionConfirmationForm/index'
import classes from './page.module.scss'

const modalSlug = 'delete-account'

export const SettingsPage: React.FC<{
  user: User
}> = (props) => {
  const { user } = props

  const { updateUser } = useAuth()
  const { openModal } = useModal()
  const [formToShow, setFormToShow] = React.useState<'account' | 'password'>('account')

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
              errorMessage: 'Passwords do not match',
              path: 'passwordConfirm',
              valid: false,
              value: data.passwordConfirm,
            },
            {
              errorMessage: 'Passwords do not match',
              path: 'password',
              valid: false,
              value: data.password,
            },
          ],
        })

        throw new Error('Please confirm that your passwords match and try again')
      }

      try {
        await updateUser({
          name: data?.name,
          email: data?.email,
          password: data?.password,
        })

        toast.success('Your account has been updated successfully.')

        setFormToShow('account')

        await revalidateCache({
          tag: 'user',
        })
      } catch (err) {
        const message = err?.message || `An error occurred while attempting to update your account`
        console.error(message) // eslint-disable-line no-console
        throw new Error(message)
      }
    },
    [updateUser],
  )

  return (
    <Fragment>
      <SectionHeader title="Account Settings" />
      <p className={classes.description}>
        {formToShow === 'account' && (
          <Fragment>
            {'To change your password, '}
            <button
              className={classes.viewButton}
              onClick={() => {
                setFormToShow('password')
              }}
              type="button"
            >
              click here
            </button>
            {'.'}
          </Fragment>
        )}
        {formToShow === 'password' && (
          <Fragment>
            {'Change your password below, or '}
            <button
              className={classes.viewButton}
              onClick={() => {
                setFormToShow('account')
              }}
              type="button"
            >
              cancel
            </button>
            {'.'}
          </Fragment>
        )}
      </p>
      <Form className={classes.form} onSubmit={handleSubmit}>
        <FormSubmissionError />
        <FormProcessing message="Updating profile, one moment" />
        {formToShow === 'account' && (
          <>
            <Text initialValue={user?.name} label="Your Full Name" path="name" />
            <Text initialValue={user?.email} label="Email" path="email" required />
          </>
        )}
        {formToShow === 'password' && (
          <>
            <Text initialValue="" label="Password" path="password" required type="password" />
            <Text
              initialValue=""
              label="Password Confirm"
              path="passwordConfirm"
              required
              type="password"
            />
          </>
        )}
        <div className={classes.buttonWrap}>
          {formToShow === 'password' && (
            <Button
              appearance="secondary"
              label="Cancel"
              onClick={() => {
                setFormToShow('account')
              }}
            />
          )}
          <Submit label="Save" />
        </div>
      </Form>
      <HR />
      <Text
        description="This is your user's ID within Payload"
        disabled
        label="User ID"
        value={user?.id}
      />
      <HR />
      <Heading as="h4" element="h2" marginBottom={false} marginTop={false}>
        Delete account
      </Heading>
      <p className={classes.description}>
        Deleting your account is permanent and cannot be undone.
      </p>
      <Button
        appearance="danger"
        className={classes.deleteAccount}
        label="Delete account"
        onClick={() => {
          openModal(modalSlug)
        }}
      />
      <ModalWindow className={classes.modal} slug={modalSlug}>
        <DeletionConfirmationForm modalSlug={modalSlug} />
      </ModalWindow>
    </Fragment>
  )
}
