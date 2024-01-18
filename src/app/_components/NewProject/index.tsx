import React, { Fragment } from 'react'
import Link from 'next/link'

import { Banner } from '@components/Banner'
import { BlockSpacing } from '@components/BlockSpacing'
import { DefaultCard } from '@components/cards/DefaultCard'
import { Gutter } from '@components/Gutter'
import { Heading, HeadingType } from '@components/Heading'
import { PixelBackground } from '@components/PixelBackground'
import { Team, Template } from '@root/payload-cloud-types'
import { FeatureFlag } from '@root/payload-types'

import classes from './index.module.scss'

export const NewProjectBlock: React.FC<{
  cardLeader?: string
  heading?: string
  headingElement?: HeadingType
  description?: React.ReactNode
  teamSlug?: Team['slug']
  templates?: Template[]
}> = props => {
  const {
    cardLeader,
    headingElement = 'h1',
    heading = 'New project',
    description,
    teamSlug,
    templates,
  } = props

  const disableProjectCreation = false

  return (
    <Fragment>
      <Gutter>
        <div className={classes.header}>
          <div className={classes.headerContent}>
            <Heading element={headingElement} marginTop={false}>
              {heading}
            </Heading>
            {disableProjectCreation ? (
              <Banner type={'warning'}>
                Project creation temporarily disabled.{' '}
                <a href="https://status.mongodb.com/">
                  MongoDB Atlas is currently experiencing an outage
                </a>
                . Project creation will return once the outage is resolved.
              </Banner>
            ) : (
              description || (
                <p className={classes.description}>
                  {'Create a project from a template, or '}
                  <Link
                    href={`/new/import${teamSlug ? `?team=${teamSlug}` : ''}`}
                    className={classes.import}
                    prefetch={false}
                  >
                    import an existing Git codebase
                  </Link>
                  {'.'}
                </p>
              )
            )}
          </div>
        </div>
        <BlockSpacing top={false}>
          <div className={classes.templatesWrapper}>
            <div className={classes.bg}>
              <PixelBackground />
            </div>
            <div className={classes.templates}>
              {!disableProjectCreation &&
                templates?.map((template, index) => (
                  <DefaultCard
                    key={template.slug}
                    className={classes.card}
                    leader={cardLeader || (index + 1).toString().padStart(2, '0')}
                    href={`/new/clone/${template.slug}${teamSlug ? `?team=${teamSlug}` : ''}`}
                    title={template.name}
                    description={template.description}
                    media={template.image}
                    pill={template.adminOnly ? 'Admin' : undefined}
                  />
                ))}
            </div>
          </div>
        </BlockSpacing>
      </Gutter>
    </Fragment>
  )
}
