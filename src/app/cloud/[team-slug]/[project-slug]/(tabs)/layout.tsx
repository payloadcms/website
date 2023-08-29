import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject'
import { DashboardTabs } from '@cloud/_components/DashboardTabs'
import { hasBadSubscription } from '@cloud/_utilities/hasBadSubscription'
import { cloudSlug } from '@cloud/slug'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ProjectBillingMessages } from './ProjectBillingMessages'

export default async props => {
  const {
    children,
    params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
  } = props

  // Note: this fetch will get deduped by the page
  // each page within this layout calls this same function
  // Next.js will only call it once
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })

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
      <DashboardTabs
        tabs={{
          [`${projectSlug}`]: {
            label: 'Overview',
            href: `/${cloudSlug}/${teamSlug}/${projectSlug}`,
          },
          ...(enableAllTabs
            ? {
                database: {
                  label: 'Database',
                  href: `/${cloudSlug}/${teamSlug}/${projectSlug}/database`,
                },
                'file-storage': {
                  label: 'File Storage',
                  href: `/${cloudSlug}/${teamSlug}/${projectSlug}/file-storage`,
                },
                logs: {
                  label: 'Logs',
                  href: `/${cloudSlug}/${teamSlug}/${projectSlug}/logs`,
                },
              }
            : {}),
          settings: {
            label: 'Settings',
            href: `/${cloudSlug}/${teamSlug}/${projectSlug}/settings`,
            error: hasBadSubscriptionStatus,
            subpaths: [
              `/${cloudSlug}/${teamSlug}/${projectSlug}/settings/billing`,
              `/${cloudSlug}/${teamSlug}/${projectSlug}/settings/domains`,
              `/${cloudSlug}/${teamSlug}/${projectSlug}/settings/email`,
              `/${cloudSlug}/${teamSlug}/${projectSlug}/settings/environment-variables`,
              `/${cloudSlug}/${teamSlug}/${projectSlug}/settings/ownership`,
              `/${cloudSlug}/${teamSlug}/${projectSlug}/settings/plan`,
            ],
          },
        }}
      />
      <ProjectBillingMessages team={team} project={project} />
      {children}
    </>
  )
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}): Promise<Metadata> {
  return {
    title: {
      template: `${teamSlug} / ${projectSlug} | %s`,
      default: 'Project',
    },
    openGraph: mergeOpenGraph({
      title: `${teamSlug} / ${projectSlug} | %s`,
      url: `/cloud/${teamSlug}/${projectSlug}`,
    }),
  }
}
