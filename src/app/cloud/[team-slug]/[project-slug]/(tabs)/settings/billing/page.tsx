import * as React from 'react'
import { fetchMe } from '@cloud/_api/fetchMe'
import { fetchProjectAndRedirect, ProjectWithSubscription } from '@cloud/_api/fetchProject'
import { ProjectCardSelector } from '@cloud/_components/CreditCardSelector/ProjectCardSelector'
import { cloudSlug } from '@cloud/slug'
import { Text } from '@forms/fields/Text'
import { Metadata } from 'next'
import Link from 'next/link'

import { Heading } from '@components/Heading'
import { MaxWidth } from '@root/app/_components/MaxWidth'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import { SectionHeader } from '../_layoutComponents/SectionHeader'

import classes from './page.module.scss'

const statusLabels = {
  active: 'Active',
  canceled: 'Canceled',
  incomplete: 'Incomplete',
  incomplete_expired: 'Incomplete Expired',
  past_due: 'Past Due',
  trialing: 'Trialing',
  unpaid: 'Unpaid',
  paused: 'Paused',
  unknown: 'Unknown',
}

export default async ({ params: { 'team-slug': teamSlug, 'project-slug': projectSlug } }) => {
  const { user } = await fetchMe()

  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID
  const hasSubscriptionID = project?.stripeSubscriptionID

  return (
    <MaxWidth>
      <SectionHeader title="Project billing" className={classes.header} />
      {!hasCustomerID && (
        <p className={classes.error}>
          This team does not have a billing account. Please contact support to resolve this issue.
        </p>
      )}
      {!hasSubscriptionID && (
        <p className={classes.error}>
          This project does not have a subscription. Please contact support to resolve this issue.
        </p>
      )}
      <div className={classes.fields}>
        <Text
          value={project?.id}
          label="Project ID"
          disabled
          description="This is your project's ID within Payload"
        />
        {hasCustomerID && hasSubscriptionID && (
          <React.Fragment>
            <Text
              disabled
              value={project?.stripeSubscriptionID}
              label="Subscription ID"
              description="This is the ID of the subscription for this project."
            />
            <Text
              value={statusLabels?.[project?.stripeSubscriptionStatus || 'unknown']}
              label="Subscription Status"
              disabled
            />
            {!isCurrentTeamOwner && (
              <p className={classes.error}>You must be an owner of this team to manage billing.</p>
            )}
            {isCurrentTeamOwner && (
              <React.Fragment>
                <Heading marginBottom={false} element="h6">
                  Payment Method
                </Heading>
                <p className={classes.description}>
                  {`Select which card to use for this project. If your payment fails, we will attempt to bill your team's default payment method (if any). To set your team's default payment method or manage all payment methods on file, please visit the `}
                  <Link href={`/${cloudSlug}/${team.slug}/settings/billing`} prefetch={false}>
                    team billing page
                  </Link>
                  {`.`}
                </p>
                <ProjectCardSelector team={team} project={project} />
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </MaxWidth>
  )
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}): Promise<Metadata> {
  return {
    title: 'Billing',
    openGraph: mergeOpenGraph({
      title: 'Billing',
      url: `/cloud/${teamSlug}/${projectSlug}/settings/billing`,
    }),
  }
}
