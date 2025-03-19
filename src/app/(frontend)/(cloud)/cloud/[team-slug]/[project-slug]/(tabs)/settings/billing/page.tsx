import type { Metadata } from 'next'

import { fetchMe } from '@cloud/_api/fetchMe'
import { fetchPaymentMethods } from '@cloud/_api/fetchPaymentMethods'
import { fetchProjectAndRedirect, ProjectWithSubscription } from '@cloud/_api/fetchProject'
import { ProjectPaymentMethodSelector } from '@cloud/_components/CreditCardSelector/ProjectPaymentMethodSelector'
import { cloudSlug } from '@cloud/slug'
import { Heading } from '@components/Heading/index'
import { MaxWidth } from '@components/MaxWidth/index'
import { Message } from '@components/Message/index'
import { Text } from '@forms/fields/Text/index'
import { PRODUCTION_ENVIRONMENT_SLUG } from '@root/constants'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import { generateRoutePath } from '@root/utilities/generate-route-path'
import Link from 'next/link'
import * as React from 'react'

import { SectionHeader } from '../_layoutComponents/SectionHeader/index'
import classes from './page.module.scss'

const statusLabels = {
  active: 'Active',
  canceled: 'Canceled',
  incomplete: 'Incomplete',
  incomplete_expired: 'Incomplete Expired',
  past_due: 'Past Due',
  paused: 'Paused',
  trialing: 'Trialing',
  unknown: 'Unknown',
  unpaid: 'Unpaid',
}

export default async ({
  params,
}: {
  params: Promise<{
    'environment-slug': string
    'project-slug': string
    'team-slug': string
  }>
}) => {
  const {
    'environment-slug': environmentSlug = PRODUCTION_ENVIRONMENT_SLUG,
    'project-slug': projectSlug,
    'team-slug': teamSlug,
  } = await params
  const { user } = await fetchMe()

  const { project, team } = await fetchProjectAndRedirect({
    environmentSlug,
    projectSlug,
    teamSlug,
  })

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
      <SectionHeader className={classes.header} title="Project billing" />
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
          description="This is your project's ID within Payload"
          disabled
          label="Project ID"
          value={project?.id}
        />
        {hasCustomerID && hasSubscriptionID && (
          <React.Fragment>
            <Text
              description="This is the ID of the subscription for this project."
              disabled
              label="Subscription ID"
              value={project?.stripeSubscriptionID}
            />
            <Text
              disabled
              label="Subscription Status"
              value={statusLabels?.[project?.stripeSubscriptionStatus || 'unknown']}
            />
            {!isCurrentTeamOwner && (
              <p className={classes.error}>You must be an owner of this team to manage billing.</p>
            )}
            {isCurrentTeamOwner && (
              <React.Fragment>
                <Heading element="h6" marginBottom={false}>
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
                  initialPaymentMethods={paymentMethods}
                  project={project}
                  team={team}
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
  params,
}: {
  params: Promise<{
    'environment-slug': string
    'project-slug': string
    'team-slug': string
  }>
}): Promise<Metadata> {
  const {
    'environment-slug': environmentSlug = PRODUCTION_ENVIRONMENT_SLUG,
    'project-slug': projectSlug,
    'team-slug': teamSlug,
  } = await params
  return {
    openGraph: mergeOpenGraph({
      title: 'Billing',
      url: generateRoutePath({
        environmentSlug,
        projectSlug,
        suffix: 'settings/billing',
        teamSlug,
      }),
    }),
    title: 'Billing',
  }
}
