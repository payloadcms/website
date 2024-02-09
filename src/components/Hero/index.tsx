import React from 'react'

import { Page } from '@root/payload-types'
import { CenteredContent } from './CenteredContent'
import { ContentMediaHero } from './ContentMedia'
import { DefaultHero } from './Default'
import { FormHero } from './FormHero'
import { HomeHero } from './Home'
import { LivestreamHero } from './Livestream'

const heroes = {
  default: DefaultHero,
  contentMedia: ContentMediaHero,
  home: HomeHero,
  form: FormHero,
  livestream: LivestreamHero,
  centeredContent: CenteredContent,
}

export const Hero: React.FC<{
  page: Page
}> = props => {
  const {
    page: {
      hero,
      breadcrumbs,
      hero: { type },
    },
  } = props

  const HeroToRender = heroes[type] as any

  if (HeroToRender) {
    return <HeroToRender {...hero} breadcrumbs={breadcrumbs} />
  }

  return null
}
