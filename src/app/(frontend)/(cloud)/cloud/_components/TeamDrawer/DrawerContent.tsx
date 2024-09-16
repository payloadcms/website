import React, { useCallback } from 'react'
import { toast } from 'sonner'
import { revalidateCache } from '@cloud/_actions/revalidateCache.js'
import { useModal } from '@faceless-ui/modal'
import { Text } from '@forms/fields/Text/index.js'
import Form from '@forms/Form/index.js'
import FormProcessing from '@forms/FormProcessing/index.js'
import FormSubmissionError from '@forms/FormSubmissionError/index.js'
import Submit from '@forms/Submit/index.js'
import { useRouter } from 'next/navigation'

import { HR } from '@components/HR/index.js'
import { Team } from '@root/payload-cloud-types.js'
import { useAuth } from '@root/providers/Auth/index.js'
import { InviteTeammates } from '../InviteTeammates/index.js'
import { UniqueTeamSlug } from '../UniqueSlug/index.js'
import { TeamDrawerProps } from './types.js'

import classes from './DrawerContent.module.scss'

export const TeamDrawerContent: React.FC<TeamDrawerProps> = ({
  drawerSlug,
  onCreate,
  redirectOnCreate,
}) => {
  const { user, setUser } = useAuth()
  const router = useRouter()

  const [errors, setErrors] = React.useState<{
    message: string
    name: string
    data: { message: string; field: string }[]
  }>()

  const { modalState, closeModal } = useModal()

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
          sendEmailInvitationsTo: unflattenedData?.sendEmailInvitationsTo?.map(invite => ({
            email: invite?.email,
            roles: invite?.roles,
          })),
        }

        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTeam),
        })

        const response: {
          doc: Team
          message: string
          errors: {
            message: string
            name: string
            data: { message: string; field: string }[]
          }[]
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
              team: response?.doc,
              roles: ['owner'],
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

  if (!isOpen) return null

  return (
    <div className="list-drawer__content">
      <Form
        onSubmit={handleSubmit}
        className={classes.form}
        errors={errors?.data}
        initialState={{
          name: {
            initialValue: 'My Team',
            value: 'My Team',
          },
        }}
      >
        <FormProcessing message="Creating team..." />
        <FormSubmissionError />
        <Text path="name" required label="Name" />
        <UniqueTeamSlug initialValue="my-team" />
        <HR margin="small" />
        <InviteTeammates />
        <HR margin="small" />
        <div>
          <Submit label="Create Team" className={classes.submit} />
        </div>
      </Form>
    </div>
  )
}
