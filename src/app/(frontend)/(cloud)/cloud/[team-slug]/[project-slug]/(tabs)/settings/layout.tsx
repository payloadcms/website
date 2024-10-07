import { Sidebar } from '@cloud/_components/Sidebar/index.js'
import { cloudSlug } from '@cloud/slug.js'
import { Gutter } from '@components/Gutter/index.js'
import * as React from 'react'

import classes from './layout.module.scss'

const settingsSlug = 'settings'

export default async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{
    'project-slug': string
    'team-slug': string
  }>
}) => {
  const { 'project-slug': projectSlug, 'team-slug': teamSlug } = await params
  return (
    <Gutter className="grid">
      <div className="cols-4 cols-m-8">
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
      <div className="cols-12 cols-m-8">{children}</div>
    </Gutter>
  )
}
