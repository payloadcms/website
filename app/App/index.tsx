import React, { use } from 'react'
import { fetchGlobals } from '../../graphql'
import { Header } from '../../components/Header'
import { Providers } from '../../components/providers'

type Props = {
  id?: string
  collection?: string
  preview?: boolean
  children: React.ReactNode
}

export const App: React.FC<Props> = ({ id, collection, preview, children }) => {
  const { mainMenu } = use(fetchGlobals())

  return (
    <Providers {...{ id, collection, preview }}>
      <Header {...mainMenu} />
      {children}
    </Providers>
  )
}
