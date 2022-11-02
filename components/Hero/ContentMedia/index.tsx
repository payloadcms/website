import React from 'react'
import { Page } from '../../../payload-types'

export const ContentMediaHero: React.FC<
  Page['hero'] & {
    pageTitle: string
  }
> = () => {
  return <div>Content + Media hero</div>
}
