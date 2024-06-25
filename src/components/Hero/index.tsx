import React from 'react'

import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar/index.js'
import { BlocksProp } from '@components/RenderBlocks/index.js'
import { Page } from '@root/payload-types.js'
import { CenteredContent } from './CenteredContent/index.js'
import { ContentMediaHero } from './ContentMedia/index.js'
import { DefaultHero } from './Default/index.js'
import { FormHero } from './FormHero/index.js'
import { GradientHero } from './Gradient/index.js'
import { HomeHero } from './Home/index.js'
import { LivestreamHero } from './Livestream/index.js'
import { ThreeHero } from './Three/index.js'

const heroes = {
  default: DefaultHero,
  contentMedia: ContentMediaHero,
  home: HomeHero,
  form: FormHero,
  livestream: LivestreamHero,
  centeredContent: CenteredContent,
  gradient: GradientHero,
  three: ThreeHero,
}

export const Hero: React.FC<{
  page: Page
  firstContentBlock?: BlocksProp
}> = props => {
  const {
    page: {
      hero,
      breadcrumbs,
      hero: { type },
    },
    firstContentBlock,
  } = props

  const HeroToRender = heroes[type] as any

  if (HeroToRender) {
    return (
      <>
        <BreadcrumbsBar hero={hero} breadcrumbs={breadcrumbs} />

        <HeroToRender {...hero} firstContentBlock={firstContentBlock} breadcrumbs={breadcrumbs} />
      </>
    )
  }

  return null
}
