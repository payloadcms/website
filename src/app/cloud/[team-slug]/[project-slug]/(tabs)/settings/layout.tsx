import { Sidebar } from '@cloud/_components/Sidebar'
import { cloudSlug } from '@cloud/slug'

import { Gutter } from '@components/Gutter'

import classes from './layout.module.scss'

const settingsSlug = 'settings'

export default async ({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
  children,
}) => {
  return (
    <Gutter>
      <div className={[classes.gridWrap, 'grid'].filter(Boolean).join(' ')}>
        <div className={['cols-4 start-1 cols-s-8'].filter(Boolean).join(' ')}>
          <Sidebar
            routes={[
              {
                label: 'General',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}`,
              },
              {
                label: 'Environment Variables',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/environment-variables`,
              },
              {
                label: 'Domains',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/domains`,
              },
              {
                label: 'Email',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/email`,
              },
              {
                label: 'Ownership',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/ownership`,
              },
              {
                label: 'Plan',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/plan`,
              },
              {
                label: 'Billing',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/billing`,
              },
            ]}
          />
        </div>
        <div className={['cols-12 start-6 start-s-1'].filter(Boolean).join(' ')}>{children}</div>
      </div>
    </Gutter>
  )
}
