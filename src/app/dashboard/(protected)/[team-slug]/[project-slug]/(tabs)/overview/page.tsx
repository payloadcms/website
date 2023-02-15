'use client'

import * as React from 'react'

import { useProject } from '../../context'

const ProjectOverviewPage = () => {
  const project = useProject()

  return <h1>{project.name}</h1>
}

export default ProjectOverviewPage
