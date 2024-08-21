'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { revalidateCache } from '@cloud/_actions/revalidateCache.js'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { InviteTeammates } from '@cloud/_components/InviteTeammates/index.js'
import { TeamInvitations } from '@cloud/_components/TeamInvitations/index.js'
import { Member, TeamMembers } from '@cloud/_components/TeamMembers/index.js'
import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader/index.js'
import { useModal } from '@faceless-ui/modal'
import Form from '@forms/Form/index.js'
import FormProcessing from '@forms/FormProcessing/index.js'
import FormSubmissionError from '@forms/FormSubmissionError/index.js'
import Submit from '@forms/Submit/index.js'
import { OnSubmit } from '@forms/types.js'

import { ModalWindow } from '@components/ModalWindow/index.js'
import { HR } from '@components/HR/index.js'
import { Team } from '@root/payload-cloud-types.js'
import { useAuth } from '@root/providers/Auth/index.js'
import { UpdateRolesConfirmationForm } from './UpdateRolesConfirmationForm/index.js'

import classes from './page.module.scss'

export const TeamMembersPage: React.FC<{
  team: TeamWithCustomer
}> = ({ team: initialTeam }) => {
  const [team, setTeam] = React.useState<Team>(initialTeam)
  const { user } = useAuth()
  const [clearCount, dispatchClearCount] = React.useReducer((state: number) => state + 1, 0)

  const { openModal } = useModal()

  const [originalRoles, setOriginalRoles] = React.useState<('owner' | 'admin' | 'user')[][]>([])
  const [selectedMemberIndex, setSelectedMemberIndex] = React.useState<number | null>(null)
  const [selectedNewRoles, setSelectedNewRoles] = React.useState<
    ('owner' | 'admin' | 'user')[] | null
  >(null)
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null)

  const [roles, setRoles] = React.useState<('owner' | 'admin' | 'user')[][]>(
    (team?.members ?? []).map(member => member.roles ?? []),
  ) // eslint-disable-line

  const [error, setError] = React.useState<{
    message: string
    name: string
    data: { message: string; field: string }[]
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
    newRoles: ('owner' | 'admin' | 'user')[],
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
    async ({ unflattenedData, dispatchFields }): Promise<void> => {
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
        sendEmailInvitationsTo: unflattenedData?.sendEmailInvitationsTo?.map(invite => ({
          email: invite?.email,
          roles: invite?.roles,
        })),
      }

      const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTeam),
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
          ...(response.doc?.sendEmailInvitationsTo?.map(invite => ({
            email: invite?.email,
            roles: invite?.roles,
            invitedOn: new Date().toISOString(),
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
      <Form onSubmit={handleSubmit} className={classes.form} errors={error?.data}>
        <FormSubmissionError />
        <FormProcessing message="Updating team, one moment..." />
        <TeamMembers
          team={team}
          onUpdateRoles={handleUpdateRoles}
          renderHeader={false}
          isOwnerOrGlobalAdmin={isOwnerOrGlobalAdmin}
          roles={roles}
        />
        <HR margin="small" />
        {team?.invitations && team?.invitations?.length > 0 && (
          <React.Fragment>
            <TeamInvitations team={team} />
            <HR />
          </React.Fragment>
        )}
        <InviteTeammates clearCount={clearCount} />
        <HR margin="small" />
        <Submit label="Save" className={classes.submit} />
      </Form>
      <ModalWindow className={classes.modal} slug="updateRoles">
        {selectedMember && (
          <UpdateRolesConfirmationForm
            modalSlug="updateRoles"
            user={user!}
            team={team}
            memberIndex={selectedMemberIndex}
            newRoles={selectedNewRoles}
            selectedMember={selectedMember}
            setRoles={setRoles}
            onRolesUpdated={newRoles => {
              const newRolesArray = [...roles]
              newRolesArray[selectedMemberIndex!] = newRoles
              setRoles(newRolesArray)
            }}
            originalRoles={originalRoles}
          />
        )}
      </ModalWindow>
    </React.Fragment>
  )
}
