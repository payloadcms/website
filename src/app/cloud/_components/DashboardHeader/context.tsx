import { createContext } from 'react'

import { Team } from '@root/payload-cloud-types'

export interface TabsContextType {
  team?: Team
}

const initialContext: TabsContextType = {
  team: undefined,
}

const TabsContext = createContext(initialContext)

export const TabsProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <TabsContext.Provider value={initialContext}>{children}</TabsContext.Provider>
}
