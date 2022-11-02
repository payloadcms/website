import React from 'react'
import { Page } from '../../../payload-types'

export const DefaultHero: React.FC<
  Page['hero'] & {
    pageTitle: string
  }
> = () => {
  return <div>Default hero</div>
}
