import React from 'react'

import { Heading } from '@components/Heading'
import { BorderBox } from '@root/app/_components/BorderBox'
import { Team } from '@root/payload-cloud-types'
import { formatDate } from '@root/utilities/format-date-time'

import classes from './index.module.scss'

export const TeamInvitations: React.FC<{
  team: Team
  className?: string
}> = ({ className, team }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [success, setSuccess] = React.useState<boolean>(false)

  const resendEmail = React.useCallback(
    async email => {
      setTimeout(() => {
        window.scrollTo(0, ref?.current?.offsetTop || 0)
      }, 0)

      if (!team || !email) {
        return
      }

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

        if (res.ok) {
          const { data, error } = await res.json()
          if (error) setError(error)
          else {
            setError(null)
            setSuccess(true)
          }
        } else {
          setError('Invalid response from server')
        }
      } catch (e) {
        setError(`Error sending invitation: ${e.message}`)
      }
    },
    [team],
  )

  return (
    <div ref={ref} className={[classes.invitations, className].filter(Boolean).join(' ')}>
      <Heading element="h6" marginTop={false}>
        Current invitations
      </Heading>
      {error && <p className={classes.error}>{error}</p>}
      {success && <p className={classes.success}>Invitation resent!</p>}
      {loading && <p className={classes.loading}>Resending invitation...</p>}
      {team?.invitations?.map(invite => (
        <div key={invite?.id} className={classes.invite}>
          <p className={classes.email}>{`Email: ${invite?.email}`}</p>
          <p>{`Roles: ${invite?.roles?.join(', ')}`}</p>
          <p>{`Invited On: ${formatDate({
            date: invite?.invitedOn || '',
          })}`}</p>
          <button
            className={classes.resendEmail}
            type="button"
            onClick={() => {
              resendEmail(invite?.email)
            }}
          >
            Resend invite
          </button>
        </div>
      ))}
    </div>
  )
}
