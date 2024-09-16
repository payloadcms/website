import React, { Fragment } from 'react'
import { toast } from 'sonner'

import { Heading } from '@components/Heading/index.js'
import { Team } from '@root/payload-cloud-types.js'
import { formatDate } from '@root/utilities/format-date-time.js'
import { TeamMemberRow } from '../TeamMembers/TeamMemberRow.js'

import classes from './index.module.scss'

export const TeamInvitations: React.FC<{
  team: Team
  className?: string
}> = ({ className, team }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)

  const resendEmail = React.useCallback(
    async email => {
      let timer: NodeJS.Timeout | null = null

      setTimeout(() => {
        window.scrollTo(0, ref?.current?.offsetTop || 0)
      }, 0)

      if (!team || !email) {
        return
      }

      timer = setTimeout(() => {
        setLoading(true)
      }, 500)

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/send-invitations`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              invitations: [{ email }],
            }),
          },
        )

        if (timer) clearTimeout(timer)
        setLoading(false)

        if (res.ok) {
          const { data, error } = await res.json()
          if (error) setError(error)
          else {
            setError(null)
            toast.success('Invitation resent.')
          }
        } else {
          throw new Error('Invalid response from server')
        }
      } catch (e) {
        setError(`Error sending invitation: ${e.message}`)
      }

      return () => {
        if (timer) clearTimeout(timer)
      }
    },
    [team],
  )

  return (
    <div ref={ref} className={[classes.invitations, className].filter(Boolean).join(' ')}>
      <Heading element="h4" marginTop={false} marginBottom={false}>
        Current invitations
      </Heading>
      <div className={classes.formState}>
        {error && <p className={classes.error}>{error}</p>}
        {loading && <p className={classes.loading}>Your invitation is being sent, one moment...</p>}
      </div>
      {team?.invitations?.map((invite, index) => (
        <TeamMemberRow
          key={`${invite?.id}-${index}`}
          leader={`Invite ${(index + 1).toString()}`}
          initialEmail={typeof invite?.email === 'string' ? invite?.email : ''}
          initialRoles={invite?.roles}
          footer={
            <Fragment>
              {invite?.invitedOn && (
                <Fragment>
                  {`Invited On `}
                  {formatDate({ date: invite.invitedOn })}
                  {'—'}
                </Fragment>
              )}
              <button
                className={classes.resendEmail}
                type="button"
                onClick={() => {
                  resendEmail(invite?.email)
                }}
              >
                Resend invite
              </button>
            </Fragment>
          }
        />
      ))}
    </div>
  )
}
