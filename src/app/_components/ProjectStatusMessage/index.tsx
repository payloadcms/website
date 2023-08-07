import Link from 'next/link'

import { Project } from '@root/payload-cloud-types'
import { Message } from '../Message'

export const ProjectStatusMessage: React.FC<{
  project: Project
}> = ({ project }) => {
  const status = project?.stripeSubscriptionStatus

  let message: React.ReactNode = null
  let warning: React.ReactNode = null
  let error: React.ReactNode = null

  if (!status) {
    warning = (
      <div>
        {`This project is not currently active. To avoid having it deleted, please `}
        <Link href={`/contact`}>contact us</Link>
        {`.`}
      </div>
    )
  }

  if (status === 'trialing') {
    warning = (
      <div>
        {`You are currently trialing. To keep this project active after your trial ends, please ensure it has a `}
        <Link
          href={`/cloud/${typeof project.team === 'string' ? project.team : project.team.slug}/${
            project.slug
          }/settings/billing`}
        >
          valid payment method
        </Link>
        {`.`}
      </div>
    )
  }

  if (status === 'canceled') {
    error = (
      <div>
        {`Your subscription has been canceled. To avoid having this project deleted, please `}
        <Link href={`/contact`}>contact us</Link>
        {`.`}
      </div>
    )
  }

  if (status === 'past_due' || status === 'unpaid') {
    error = (
      <div>
        {`Your subscription payment has failed. To avoid having this project deleted, ensure it has a `}
        <Link
          href={`/cloud/${typeof project.team === 'string' ? project.team : project.team.slug}/${
            project.slug
          }/settings/billing`}
        >
          valid payment method
        </Link>
        {` or `}
        <Link href={`/contact`}>contact us</Link>
        {`.`}
      </div>
    )
  }

  return <Message message={message} warning={warning} error={error} />
}
