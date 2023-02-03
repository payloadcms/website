'use client'

import * as React from 'react'
import { useTheme } from '@providers/Theme'

import { HeaderObserver } from '@components/HeaderObserver'
import { useAuth } from '@root/providers/Auth'
import { LandingNoUser } from './LandingNoUser'

const AllProjectsLayout = ({ children }) => {
  const theme = useTheme()
  const { user } = useAuth()

  return (
    <HeaderObserver color={theme} pullUp>
      {!user ? <LandingNoUser /> : children}
    </HeaderObserver>
  )
}

export default AllProjectsLayout
