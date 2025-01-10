import type { BlocksProp } from '@components/RenderBlocks/index.js'
import type { Page } from '@root/payload-types.js'

import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar/index.js'
import React from 'react'

import { CenteredContent } from './CenteredContent/index.js'
import { ContentMediaHero } from './ContentMedia/index.js'
import { DefaultHero } from './Default/index.js'
import { FormHero } from './FormHero/index.js'
import { GradientHero } from './Gradient/index.js'
import { HomeHero } from './Home/index.js'
import { HomeNewHero } from './HomeNew/index.js'
import { LivestreamHero } from './Livestream/index.js'
import { ThreeHero } from './Three/index.js'

const heroes = {
  centeredContent: CenteredContent,
  contentMedia: ContentMediaHero,
  default: DefaultHero,
  form: FormHero,
  gradient: GradientHero,
  home: HomeHero,
  homeNew: HomeNewHero,
  livestream: LivestreamHero,
  three: ThreeHero,
}

export const Hero: React.FC<{
  firstContentBlock?: BlocksProp
  page: Page
}> = (props) => {
  const {
    firstContentBlock,
    page: {
      breadcrumbs,
      hero,
      hero: { type },
    },
  } = props

  const HeroToRender = heroes[type] as any

  if (HeroToRender) {
    return (
      <>
        <BreadcrumbsBar breadcrumbs={breadcrumbs} hero={hero} />

        <HeroToRender {...hero} breadcrumbs={breadcrumbs} firstContentBlock={firstContentBlock} />
      </>
    )
  }

  return null
}
