import * as React from 'react'
import { fetchMe } from '@cloud/_api/fetchMe.js'
import { fetchPaymentMethods } from '@cloud/_api/fetchPaymentMethods.js'
import { fetchProjectAndRedirect, ProjectWithSubscription } from '@cloud/_api/fetchProject.js'
import { ProjectPaymentMethodSelector } from '@cloud/_components/CreditCardSelector/ProjectPaymentMethodSelector.js'
import { cloudSlug } from '@cloud/slug.js'
import { Text } from '@forms/fields/Text/index.js'
import { Metadata } from 'next'
import Link from 'next/link'

import { Heading } from '@components/Heading/index.js'
import { MaxWidth } from '@components/MaxWidth/index.js'
import { Message } from '@components/Message/index.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { checkTeamRoles } from '@root/utilities/check-team-roles.js'
import { SectionHeader } from '../_layoutComponents/SectionHeader/index.js'

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

  const paymentMethods = await fetchPaymentMethods({
    team,
  })

  // check if this plan is free, and do not show a message if it is
  // some plans are have pricing that is different than what is offered in the UI
  // so instead of checking `project.plan` we check the amount of the `stripeSubscription`
  const isFreeTier = !project.stripeSubscription?.plan?.amount // could be `0` or `null`

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
                {isFreeTier && (
                  <Message
                    success={`This project is on a free tier. No billing information is required.`}
                  />
                )}
                <p className={classes.description}>
                  {`Select which card to use for this project. If your payment fails, we will attempt to bill your team's default payment method (if any). To set your team's default payment method or manage all payment methods on file, please visit the `}
                  <Link href={`/${cloudSlug}/${team.slug}/settings/billing`} prefetch={false}>
                    team billing page
                  </Link>
                  {`.`}
                </p>
                <ProjectPaymentMethodSelector
                  team={team}
                  project={project}
                  initialPaymentMethods={paymentMethods}
                />
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
