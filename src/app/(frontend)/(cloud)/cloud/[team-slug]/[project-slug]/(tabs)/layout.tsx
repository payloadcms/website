import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { DashboardTabs } from '@cloud/_components/DashboardTabs/index.js'
import { hasBadSubscription } from '@cloud/_utilities/hasBadSubscription.js'
import { cloudSlug } from '@cloud/slug.js'
import { Metadata } from 'next'

import { Gutter } from '@components/Gutter/index.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { ProjectBillingMessages } from './ProjectBillingMessages/index.js'

import { ProjectHeader } from '@cloud/_components/ProjectHeader/index.js'
import { generateRoutePath } from '@root/utilities/generate-route-path.js'

export default async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{
    'team-slug': string
    'project-slug': string
    'environment-slug': string
  }>
}) => {
  const {
    'environment-slug': environmentSlug,
    'project-slug': projectSlug,
    'team-slug': teamSlug,
  } = await params

  // Note: this fetch will get deduped by the page
  // each page within this layout calls this same function
  // Next.js will only call it once
  const { team, project } = await fetchProjectAndRedirect({
    teamSlug,
    projectSlug,
    environmentSlug,
  })

  // display an error if the project has a bad subscription status
  const hasBadSubscriptionStatus = hasBadSubscription(project?.stripeSubscriptionStatus)

  // disable some tabs when the `infraStatus` is not active
  // if infra failed, enable settings tab
  // i.e. db creation was successful, but the app failed to deploy, or is deploying
  const enableAllTabs =
    (project?.infraStatus && !['notStarted', 'awaitingDatabase'].includes(project.infraStatus)) ||
    project?.infraStatus === 'done'

  return (
    <>
      <Gutter>
        <ProjectHeader
          title={project.name}
          environmentOptions={
            project?.environments?.reduce(
              (acc, { name, environmentSlug }) => {
                acc.push({ label: name, value: environmentSlug })
                return acc
              },
              [{ label: 'Production', value: 'production' }],
            ) || []
          }
        />
        <DashboardTabs
          tabs={{
            [`${projectSlug}`]: {
              label: 'Overview',
              href: generateRoutePath({
                teamSlug,
                projectSlug,
                environmentSlug,
              }),
            },
            ...(enableAllTabs
              ? {
                  database: {
                    label: 'Database',
                    href: generateRoutePath({
                      teamSlug,
                      projectSlug,
                      environmentSlug,
                      suffix: 'database',
                    }),
                  },
                  'file-storage': {
                    label: 'File Storage',
                    href: generateRoutePath({
                      teamSlug,
                      projectSlug,
                      environmentSlug,
                      suffix: 'file-storage',
                    }),
                  },
                  logs: {
                    label: 'Logs',
                    href: generateRoutePath({
                      teamSlug,
                      projectSlug,
                      environmentSlug,
                      suffix: 'logs',
                    }),
                  },
                }
              : {}),
            settings: {
              label: 'Settings',
              href: generateRoutePath({
                teamSlug,
                projectSlug,
                environmentSlug,
                suffix: 'settings',
              }),
              error: hasBadSubscriptionStatus,
            },
          }}
        />
      </Gutter>
      <ProjectBillingMessages team={team} project={project} />
      {children}
    </>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    'team-slug': string
    'project-slug': string
    'environment-slug': string
  }>
}): Promise<Metadata> {
  const {
    'team-slug': teamSlug,
    'project-slug': projectSlug,
    'environment-slug': environmentSlug,
  } = await params
  return {
    title: {
      template: `${teamSlug} / ${projectSlug}${
        environmentSlug ? ` / ${environmentSlug}` : ''
      } | %s`,
      default: 'Project',
    },
    openGraph: mergeOpenGraph({
      title: `${teamSlug} / ${projectSlug} | %s`,
      url: `/cloud/${teamSlug}/${projectSlug}${environmentSlug ? `/env/${environmentSlug}` : ''}`,
    }),
  }
}
