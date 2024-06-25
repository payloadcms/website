import React, { Fragment } from 'react'
import Link from 'next/link'

import { Banner } from '@components/Banner/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Media } from '@components/Media/index.js'
import { Pill } from '@components/Pill/index.js'
import { Team, Template } from '@root/payload-cloud-types.js'

import classes from './index.module.scss'

export const NewProjectBlock: React.FC<{
  cardLeader?: string
  description?: React.ReactNode
  teamSlug?: Team['slug']
  templates?: Template[]
  largeHeading?: boolean
  heading?: string
}> = props => {
  const {
    cardLeader,
    description,
    teamSlug,
    templates,
    largeHeading,
    heading = 'New Project',
  } = props

  const disableProjectCreation = false

  return (
    <Fragment>
      <Gutter>
        <div className={classes.header}>
          <div className={classes.headerContent}>
            {largeHeading ? <h2>{heading}</h2> : <h4>{heading}</h4>}
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
        <div className={['grid', classes.templatesWrapper].join(' ')}>
          {!disableProjectCreation &&
            templates?.map((template, index) => {
              const { slug, name, description, image, adminOnly } = template
              return (
                <Link
                  href={`/new/clone/${template.slug}${teamSlug ? `?team=${teamSlug}` : ''}`}
                  className={['cols-8', classes.templateCard].filter(Boolean).join(' ')}
                  key={slug}
                >
                  {image && typeof image !== 'string' && (
                    <Media
                      className={classes.templateImage}
                      sizes="(max-width: 768px) 100vw, 20vw"
                      src={image.url}
                      width={image.width}
                      height={image.height}
                      alt={image.alt}
                    />
                  )}
                  <div className={classes.templateCardDetails}>
                    <h6 className={classes.leader}>
                      {cardLeader || (index + 1).toString().padStart(2, '0')}
                    </h6>
                    {name && <h5>{name}</h5>}
                    {description && <p>{description}</p>}
                    {adminOnly && <Pill color="warning" text="Admin Only" />}
                  </div>
                </Link>
              )
            })}
        </div>
      </Gutter>
    </Fragment>
  )
}
