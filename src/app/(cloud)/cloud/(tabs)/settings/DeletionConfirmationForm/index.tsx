import React from 'react'
import { toast } from 'react-toastify'
import { useModal } from '@faceless-ui/modal'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Submit from '@forms/Submit'
import { useRouter } from 'next/navigation'

import { Button } from '@components/Button'
import { Heading } from '@components/Heading'
import { Message } from '@root/app/_components/Message'
import { useAuth } from '@root/providers/Auth'

import classes from './page.module.scss'

export const DeletionConfirmationForm: React.FC<{
  modalSlug: string
}> = props => {
  const { modalSlug } = props
  const { closeModal } = useModal()
  const [hasEmail, setHasEmail] = React.useState(false)
  const [hasPW, setHasPW] = React.useState(false)
  const router = useRouter()
  const { user, login } = useAuth()

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
                toast.success('Your account has been deleted successfully.')
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
    <Form onSubmit={deleteAccount}>
      <Heading marginTop={false} as="h3">
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
        <Button label="Cancel" appearance="secondary" onClick={() => closeModal(modalSlug)} />
        <Submit label="Delete my account" appearance="danger" disabled={!(hasEmail && hasPW)} />
      </div>
    </Form>
  )
}
