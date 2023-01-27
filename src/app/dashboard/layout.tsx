'use client'

import * as React from 'react'

import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@providers/Theme'

const AllProjectsLayout = ({ children }) => {
  const theme = useTheme()

  return (
    <HeaderObserver color={theme} pullUp>
      {children}
    </HeaderObserver>
  )
}

export default AllProjectsLayout
