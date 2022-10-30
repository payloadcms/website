import React from 'react'
import { Header } from '../../../components/Header'
import { fetchGlobals } from '../../../graphql'

export const Globals = async () => {
  const { mainMenu } = await fetchGlobals()
  return (
    <React.Fragment>
      <Header {...mainMenu} />
    </React.Fragment>
  )
}
