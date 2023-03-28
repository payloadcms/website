'use client'

import * as React from 'react'
import { redirect, usePathname } from 'next/navigation'

import { useAuth } from '@root/providers/Auth'

const AllProjectsLayout = ({ children }) => {
  const pathname = usePathname()
  const { user } = useAuth()

  if (user === undefined) return null

  if (user === null)
    redirect(
      `/login?redirect=${encodeURIComponent(pathname || '')}&message=${encodeURIComponent(
        'You must first login to import your project.',
      )}`,
    )

  return <>{children}</>
}

export default AllProjectsLayout
