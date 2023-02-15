'use client'

import * as React from 'react'

import { Project } from '@root/payload-cloud-types'

const Context = React.createContext<Project>({} as Project)

export const useProject = () => React.useContext(Context)

export const ProjectProvider = ({ children, project }) => {
  return <Context.Provider value={project}>{children}</Context.Provider>
}
