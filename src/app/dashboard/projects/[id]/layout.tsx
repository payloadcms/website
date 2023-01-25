'use client'

import * as React from 'react'

import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@providers/Theme'
import Link from 'next/link'

const basePath = '/dashboard/projects'

type ProjectLayoutType = {
  children: React.ReactNode
  params: {
    id: string
  }
}
const ProjectLayout = ({ children, params }: ProjectLayoutType) => {
  const theme = useTheme()

  return (
    <HeaderObserver color={theme} pullUp>
      <div>
        <Link href={`${basePath}/${params.id}/`}>Overview</Link>
        <Link href={`${basePath}/${params.id}/logs`}>Logs</Link>
        <Link href={`${basePath}/${params.id}/database`}>Database</Link>
        <Link href={`${basePath}/${params.id}/file-storage`}>File Storage</Link>
        <Link href={`${basePath}/${params.id}/settings`}>Settings</Link>
      </div>
      {children}
    </HeaderObserver>
  )
}

export default ProjectLayout
