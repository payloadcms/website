'use client'

import * as React from 'react'

import { useRouteData } from '../../../../context'

export default () => {
  const { project } = useRouteData()

  return <h1>{project.name}</h1>
}
