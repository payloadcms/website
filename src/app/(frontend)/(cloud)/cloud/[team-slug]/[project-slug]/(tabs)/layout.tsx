import type { Metadata } from 'next'

import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject'
import { DashboardTabs } from '@cloud/_components/DashboardTabs/index'
import { ProjectHeader } from '@cloud/_components/ProjectHeader/index'
import { hasBadSubscription } from '@cloud/_utilities/hasBadSubscription'
import { cloudSlug } from '@cloud/slug'
import { Gutter } from '@components/Gutter/index'
import { PRODUCTION_ENVIRONMENT_SLUG } from '@root/constants'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { generateRoutePath } from '@root/utilities/generate-route-path'

import { ProjectBillingMessages } from './ProjectBillingMessages/index'

export default async ({
  children,
  params,
}: {
  children: React.ReactNode
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

  // Note: this fetch will get deduped by the page
  // each page within this layout calls this same function
  // Next.js will only call it once
  const { project, team } = await fetchProjectAndRedirect({
    environmentSlug,
    projectSlug,
    teamSlug,
  })

  // display an error if the project has a bad subscription status
  const hasBadSubscriptionStatus = hasBadSubscription(project?.stripeSubscriptionStatus)

  // disable some tabs when the `infraStatus` is not active
  // if infra failed, enable settings tab
  // i.e. db creation was successful, but the app failed to deploy, or is deploying
  const enableAllTabs =
    (project?.infraStatus && !['awaitingDatabase', 'notStarted'].includes(project.infraStatus)) ||
    project?.infraStatus === 'done'

  return (
    <>
      <Gutter>
        <ProjectHeader
          environmentOptions={
            project?.environments?.reduce(
              (acc, { name, environmentSlug }) => {
                acc.push({ label: name, value: environmentSlug })
                return acc
              },
              [{ label: 'Production', value: PRODUCTION_ENVIRONMENT_SLUG }],
            ) || []
          }
          title={project.name}
        />
        <DashboardTabs
          tabs={{
            [`${projectSlug}`]: {
              href: generateRoutePath({
                environmentSlug,
                projectSlug,
                teamSlug,
              }),
              label: 'Overview',
            },
            ...(enableAllTabs
              ? {
                  database: {
                    href: generateRoutePath({
                      environmentSlug,
                      projectSlug,
                      suffix: 'database',
                      teamSlug,
                    }),
                    label: 'Database',
                  },
                  'file-storage': {
                    href: generateRoutePath({
                      environmentSlug,
                      projectSlug,
                      suffix: 'file-storage',
                      teamSlug,
                    }),
                    label: 'File Storage',
                  },
                  logs: {
                    href: generateRoutePath({
                      environmentSlug,
                      projectSlug,
                      suffix: 'logs',
                      teamSlug,
                    }),
                    label: 'Logs',
                  },
                }
              : {}),
            settings: {
              error: hasBadSubscriptionStatus,
              href: generateRoutePath({
                environmentSlug,
                projectSlug,
                suffix: 'settings',
                teamSlug,
              }),
              label: 'Settings',
            },
          }}
        />
      </Gutter>
      <ProjectBillingMessages project={project} team={team} />
      {children}
    </>
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
      title: `${teamSlug} / ${projectSlug} | %s`,
      url: `/cloud/${teamSlug}/${projectSlug}${environmentSlug ? `/env/${environmentSlug}` : ''}`,
    }),
    title: {
      default: 'Project',
      template: `${teamSlug} / ${projectSlug}${
        environmentSlug ? ` / ${environmentSlug}` : ''
      } | %s`,
    },
  }
}
