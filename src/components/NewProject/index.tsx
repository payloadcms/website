import type { Team, Template } from '@root/payload-cloud-types'

import { Banner } from '@components/Banner/index'
import { Gutter } from '@components/Gutter/index'
import { Media } from '@components/Media/index'
import { Pill } from '@components/Pill/index'
import Link from 'next/link'
import React, { Fragment } from 'react'

import classes from './index.module.scss'

export const NewProjectBlock: React.FC<{
  cardLeader?: string
  description?: React.ReactNode
  heading?: string
  largeHeading?: boolean
  teamSlug?: Team['slug']
  templates?: Template[]
}> = (props) => {
  const {
    cardLeader,
    description,
    heading = 'New Project',
    largeHeading,
    teamSlug,
    templates,
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
                    className={classes.import}
                    href={`/new/import${teamSlug ? `?team=${teamSlug}` : ''}`}
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
              const { name, slug, adminOnly, description, image } = template
              return (
                <Link
                  className={['cols-8', classes.templateCard].filter(Boolean).join(' ')}
                  href={`/new/clone/${template.slug}${teamSlug ? `?team=${teamSlug}` : ''}`}
                  key={slug}
                >
                  {image && typeof image !== 'string' && (
                    <Media
                      alt={image.alt}
                      className={classes.templateImage}
                      height={image.height}
                      sizes="(max-width: 768px) 100vw, 20vw"
                      src={image.url}
                      width={image.width}
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
