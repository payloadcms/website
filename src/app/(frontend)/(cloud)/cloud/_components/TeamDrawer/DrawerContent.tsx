import type { Team } from '@root/payload-cloud-types'

import { revalidateCache } from '@cloud/_actions/revalidateCache'
import { HR } from '@components/HR/index'
import { useModal } from '@faceless-ui/modal'
import { Text } from '@forms/fields/Text/index'
import Form from '@forms/Form/index'
import FormProcessing from '@forms/FormProcessing/index'
import FormSubmissionError from '@forms/FormSubmissionError/index'
import Submit from '@forms/Submit/index'
import { useAuth } from '@root/providers/Auth/index'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'
import { toast } from 'sonner'

import type { TeamDrawerProps } from './types'

import { InviteTeammates } from '../InviteTeammates/index'
import { UniqueTeamSlug } from '../UniqueSlug/index'
import classes from './DrawerContent.module.scss'

export const TeamDrawerContent: React.FC<TeamDrawerProps> = ({
  drawerSlug,
  onCreate,
  redirectOnCreate,
}) => {
  const { setUser, user } = useAuth()
  const router = useRouter()

  const [errors, setErrors] = React.useState<{
    data: { field: string; message: string }[]
    message: string
    name: string
  }>()

  const { closeModal, modalState } = useModal()

  const handleSubmit = useCallback(
    async ({ unflattenedData }) => {
      if (user) {
        // TODO: access the ref directly, might need to publish a `forwardRef` modal or add it to context
        // pretty sure this doesn't work anyway
        const modalRef = document.querySelector(`[id^="${drawerSlug}"]`)

        if (modalRef) {
          setTimeout(() => {
            modalRef.scrollTop = 0
          }, 0)
        }

        const newTeam: Team = {
          ...(unflattenedData || {}),
          billingEmail: user?.email,
          // flatten `roles` to an array of values
          // there's probably a better way to do this like using `flattenedData` or modifying the API handler
          sendEmailInvitationsTo: unflattenedData?.sendEmailInvitationsTo?.map((invite) => ({
            email: invite?.email,
            roles: invite?.roles,
          })),
        }

        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams`, {
          body: JSON.stringify(newTeam),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })

        const response: {
          doc: Team
          errors: {
            data: { field: string; message: string }[]
            message: string
            name: string
          }[]
          message: string
        } = await req.json()

        if (!req.ok) {
          setErrors(response?.errors?.[0])
          throw new Error(response?.errors?.[0]?.message)
        }

        setUser({
          ...user,
          teams: [
            ...(user?.teams || []),
            // the api adds the user as an owner automatically, need to sync that here
            // this data does not come back from the API in the response
            {
              roles: ['owner'],
              team: response?.doc,
            },
          ],
        })

        if (redirectOnCreate) {
          toast.success('Team created successfully, you are now being redirected...')

          // revalidate this tag so that the next client-side navigation to this page is up to date
          await revalidateCache({
            tag: 'teams',
          })

          // automatically redirect to the new team
          router.push(`/cloud/${response?.doc?.slug}`)
        } else if (typeof onCreate === 'function') {
          // don't close the drawer here, this is bc redirects are not async
          // i.e. if you wanted to redirect yourself in the callback, the drawer would close before the redirect
          // so instead, pass it back to them to call when/if they want
          await onCreate(response?.doc, () => {
            closeModal(drawerSlug)
          })
        } else {
          closeModal(drawerSlug)
        }
      }
    },
    [onCreate, user, drawerSlug, setUser, closeModal, redirectOnCreate, router],
  )

  const isOpen = modalState[drawerSlug]?.isOpen

  if (!isOpen) {
    return null
  }

  return (
    <div className="list-drawer__content">
      <Form
        className={classes.form}
        errors={errors?.data}
        initialState={{
          name: {
            initialValue: 'My Team',
            value: 'My Team',
          },
        }}
        onSubmit={handleSubmit}
      >
        <FormProcessing message="Creating team..." />
        <FormSubmissionError />
        <Text label="Name" path="name" required />
        <UniqueTeamSlug initialValue="my-team" />
        <HR margin="small" />
        <InviteTeammates />
        <HR margin="small" />
        <div>
          <Submit className={classes.submit} label="Create Team" />
        </div>
      </Form>
    </div>
  )
}
