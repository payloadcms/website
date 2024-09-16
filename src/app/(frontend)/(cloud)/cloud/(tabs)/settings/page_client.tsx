'use client'

import React, { Fragment, useCallback } from 'react'
import { revalidateCache } from '@cloud/_actions/revalidateCache.js'
import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader/index.js'
import { useModal } from '@faceless-ui/modal'
import { Text } from '@forms/fields/Text/index.js'
import Form from '@forms/Form/index.js'
import FormProcessing from '@forms/FormProcessing/index.js'
import FormSubmissionError from '@forms/FormSubmissionError/index.js'
import Submit from '@forms/Submit/index.js'
import { OnSubmit } from '@forms/types.js'

import { Button } from '@components/Button/index.js'
import { Heading } from '@components/Heading/index.js'
import { ModalWindow } from '@components/ModalWindow/index.js'
import { HR } from '@components/HR/index.js'
import { User } from '@root/payload-cloud-types.js'
import { useAuth } from '@root/providers/Auth/index.js'
import { DeletionConfirmationForm } from './DeletionConfirmationForm/index.js'

import classes from './page.module.scss'
import { toast } from 'sonner'

const modalSlug = 'delete-account'

export const SettingsPage: React.FC<{
  user: User
}> = props => {
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
            {'Change your password below, or '}
            <button
              className={classes.viewButton}
              type="button"
              onClick={() => {
                setFormToShow('account')
              }}
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
            <Text path="name" label="Your Full Name" initialValue={user?.name} />
            <Text path="email" label="Email" required initialValue={user?.email} />
          </>
        )}
        {formToShow === 'password' && (
          <>
            <Text type="password" path="password" label="Password" required initialValue="" />
            <Text
              type="password"
              path="passwordConfirm"
              label="Password Confirm"
              required
              initialValue=""
            />
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
          <Submit label="Save" />
        </div>
      </Form>
      <HR />
      <Text
        value={user?.id}
        label="User ID"
        disabled
        description="This is your user's ID within Payload"
      />
      <HR />
      <Heading element="h2" as="h4" marginTop={false} marginBottom={false}>
        Delete account
      </Heading>
      <p className={classes.description}>
        Deleting your account is permanent and cannot be undone.
      </p>
      <Button
        className={classes.deleteAccount}
        label="Delete account"
        appearance="danger"
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
