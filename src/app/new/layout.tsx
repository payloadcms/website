'use client'

import * as React from 'react'

import { useAuth } from '@root/providers/Auth'
import { LandingNoUser } from './LandingNoUser'

const AllProjectsLayout = ({ children }) => {
  const { user } = useAuth()

  if (user === undefined) return null

  if (user === null) return <LandingNoUser />

  return <>{children}</>
}

export default AllProjectsLayout
