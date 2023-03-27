'use client'

import React from 'react'

import { Dashboard } from '@root/app/cloud/Dashboard'
import { Page } from '@root/payload-types'
import { useAuth } from '@root/providers/Auth'
import { PageContent } from './PageContent'

export const CloudLanding: React.FC<{
  page: Page
}> = ({ page }) => {
  const { user } = useAuth()

  if (user) {
    return <Dashboard />
  }

  return <PageContent page={page} />
}
