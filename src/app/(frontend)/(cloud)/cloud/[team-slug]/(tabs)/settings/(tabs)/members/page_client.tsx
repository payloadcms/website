'use client'

import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import type { Member } from '@cloud/_components/TeamMembers/index'
import type { OnSubmit } from '@forms/types'
import type { Team } from '@root/payload-cloud-types'

import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader/index'
import { revalidateCache } from '@cloud/_actions/revalidateCache'
import { InviteTeammates } from '@cloud/_components/InviteTeammates/index'
import { TeamInvitations } from '@cloud/_components/TeamInvitations/index'
import { TeamMembers } from '@cloud/_components/TeamMembers/index'
import { Banner } from '@components/Banner'
import { HR } from '@components/HR/index'
import { ModalWindow } from '@components/ModalWindow/index'
import { useModal } from '@faceless-ui/modal'
import Form from '@forms/Form/index'
import FormProcessing from '@forms/FormProcessing/index'
import FormSubmissionError from '@forms/FormSubmissionError/index'
import Submit from '@forms/Submit/index'
import { useAuth } from '@root/providers/Auth/index'
import Link from 'next/link'
import * as React from 'react'
import { toast } from 'sonner'

import classes from './page.module.scss'
import { UpdateRolesConfirmationForm } from './UpdateRolesConfirmationForm/index'

export const TeamMembersPage: React.FC<{
  team: TeamWithCustomer
}> = ({ team: initialTeam }) => {
  const [team, setTeam] = React.useState<Team>(initialTeam)
  const { user } = useAuth()
  const [clearCount, dispatchClearCount] = React.useReducer((state: number) => state + 1, 0)

  const { openModal } = useModal()

  const [originalRoles, setOriginalRoles] = React.useState<('admin' | 'owner' | 'user')[][]>([])
  const [selectedMemberIndex, setSelectedMemberIndex] = React.useState<null | number>(null)
  const [selectedNewRoles, setSelectedNewRoles] = React.useState<
    ('admin' | 'owner' | 'user')[] | null
  >(null)
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null)

  const [roles, setRoles] = React.useState<('admin' | 'owner' | 'user')[][]>(
    (team?.members ?? []).map((member) => member.roles ?? []),
  )

  const [error, setError] = React.useState<{
    data: { field: string; message: string }[]
    message: string
    name: string
  }>()

  // Determines if the current user is either a global admin or a team owner.
  const isOwnerOrGlobalAdmin = React.useMemo(() => {
    const isGlobalAdmin = user?.roles?.includes('admin')
    const currentUserRoles = roles.find((_, index) => {
      const currentUser = team?.members?.[index]?.user
      return typeof currentUser === 'object' && currentUser?.id === user?.id
    })
    const isTeamOwner = currentUserRoles?.includes('owner')
    return isTeamOwner || isGlobalAdmin || false
  }, [roles, team?.members, user?.id, user?.roles])

  // Triggers when a user tries to update roles of a team member.
  const handleUpdateRoles = async (
    index: number,
    newRoles: ('admin' | 'owner' | 'user')[],
    member: Member,
  ) => {
    if (!isOwnerOrGlobalAdmin) {
      toast.error('You must be an owner or global admin to update roles.')
      return
    }

    if (!user) {
      toast.error('You must be logged in to update roles.')
      return
    }

    const newRolesArray = [...roles]
    newRolesArray[index] = newRoles
    setRoles(newRolesArray)

    setOriginalRoles(roles)

    setSelectedMemberIndex(index)
    setSelectedNewRoles(newRoles)
    setSelectedMember(member)
    openModal('updateRoles')
  }

  const handleSubmit: OnSubmit = React.useCallback(
    async ({ dispatchFields, unflattenedData }): Promise<void> => {
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 0)

      if (!user) {
        toast.error('You must be logged in to update a team.')
        return
      }

      setError(undefined)

      const updatedTeam: Partial<Team> = {
        ...(unflattenedData || {}),
        sendEmailInvitationsTo: unflattenedData?.sendEmailInvitationsTo?.map((invite) => ({
          email: invite?.email,
          roles: invite?.roles,
        })),
      }

      const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}`, {
        body: JSON.stringify(updatedTeam),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
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
        toast.error(`Failed to update settings: ${response?.errors?.[0]?.message}`)
        setError(response?.errors?.[0])
        return
      }

      // the `invitations` property is not on the response fully
      // this is bc is has not been populated yet after the hooks send the email
      // so just grab it from `sendEmailInvitationsTo` and merge them in manually
      // we can fake the `invitedOn` date bc is not populated until _after_ the email is sent
      setTeam({
        ...response.doc,
        invitations: [
          ...(team?.invitations || []),
          ...(response.doc?.sendEmailInvitationsTo?.map((invite) => ({
            email: invite?.email,
            invitedOn: new Date().toISOString(),
            roles: invite?.roles,
          })) || []),
        ],
      })

      // `sendEmailInvitationsTo` is the only field in this form
      // this means we an simply reset the whole form
      dispatchFields({
        type: 'RESET',
        payload: {
          sendEmailInvitationsTo: {
            value: [],
          },
        },
      })

      // need to also clear the array provider, though
      // this is not tied into form state but in the future we should do this
      dispatchClearCount()

      toast.success('Team updated successfully.')

      await revalidateCache({
        tag: `team_${team?.id}`,
      })
    },
    [user, team, setTeam],
  )

  return (
    <React.Fragment>
      <SectionHeader title="Team Members" />
      <Form className={classes.form} errors={error?.data} onSubmit={handleSubmit}>
        <FormSubmissionError />
        <FormProcessing message="Updating team, one moment..." />
        <TeamMembers
          isOwnerOrGlobalAdmin={isOwnerOrGlobalAdmin}
          onUpdateRoles={handleUpdateRoles}
          renderHeader={false}
          roles={roles}
          team={team}
        />
        <HR margin="small" />
        {/* {team?.invitations && team?.invitations?.length > 0 && (
          <React.Fragment>
            <TeamInvitations team={team} />
            <HR />
          </React.Fragment>
        )} */}
        <Banner type="warning">
          <p>
            Editing teams is currently not available. To make changes to your team, please contact{' '}
            <Link href={'mailto:support@payloadcms.com'}>support@payloadcms.com</Link>
          </p>
        </Banner>
        <Submit className={classes.submit} label="Save" />
      </Form>
      <ModalWindow className={classes.modal} slug="updateRoles">
        {selectedMember && (
          <UpdateRolesConfirmationForm
            memberIndex={selectedMemberIndex}
            modalSlug="updateRoles"
            newRoles={selectedNewRoles}
            onRolesUpdated={(newRoles) => {
              const newRolesArray = [...roles]
              newRolesArray[selectedMemberIndex!] = newRoles
              setRoles(newRolesArray)
            }}
            originalRoles={originalRoles}
            selectedMember={selectedMember}
            setRoles={setRoles}
            team={team}
            user={user!}
          />
        )}
      </ModalWindow>
    </React.Fragment>
  )
}
