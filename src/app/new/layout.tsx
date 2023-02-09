'use client'

import * as React from 'react'

import { useAuth } from '@root/providers/Auth'
import { LandingNoUser } from './LandingNoUser'

const AllProjectsLayout = ({ children }) => {
  const { user } = useAuth()

  if (!user) return <LandingNoUser />

  return <>{children}</>
}

export default AllProjectsLayout
