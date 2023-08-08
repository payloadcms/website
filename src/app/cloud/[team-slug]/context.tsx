import { createContext } from 'react'

import { Team } from '@root/payload-cloud-types'

export interface TeamContextType {
  team?: Team
}

const initialContext: TeamContextType = {
  team: undefined,
}

const TeamContext = createContext(initialContext)

export const TeamProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <TeamContext.Provider value={initialContext}>{children}</TeamContext.Provider>
}
