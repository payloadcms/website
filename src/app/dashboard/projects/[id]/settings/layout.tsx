'use client'

import * as React from 'react'

import Link from 'next/link'

const basePath = '/dashboard/projects'

type ProjectSettingsLayoutType = {
  children: React.ReactNode
  params: {
    id: string
  }
}
const ProjectSettingsLayout = ({ children, params }: ProjectSettingsLayoutType) => {
  return (
    <div>
      {/* settings page sidebar */}
      <div>
        <Link href={`${basePath}/${params.id}/settings`}>Build Settings</Link>
        <Link href={`${basePath}/${params.id}/settings/environment-variables`}>
          Environment Variables
        </Link>
        <Link href={`${basePath}/${params.id}/settings/domain`}>Domain</Link>
        <Link href={`${basePath}/${params.id}/settings/ownership`}>Ownership</Link>
        <Link href={`${basePath}/${params.id}/settings/plan`}>Plan</Link>
        <Link href={`${basePath}/${params.id}/settings/billing`}>Billing</Link>
      </div>

      {/* settings page content */}
      {children}
    </div>
  )
}

export default ProjectSettingsLayout
