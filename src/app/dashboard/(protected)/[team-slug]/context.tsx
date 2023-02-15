'use client'

import * as React from 'react'

import { Team } from '@root/payload-cloud-types'

const Context = React.createContext<Team>({} as Team)

export const useTeam = () => React.useContext(Context)

export const TeamProvider = ({ children, team }) => {
  return <Context.Provider value={team}>{children}</Context.Provider>
}
