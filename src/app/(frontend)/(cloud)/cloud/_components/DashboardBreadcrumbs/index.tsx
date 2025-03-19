'use client'

import { cloudSlug } from '@cloud/slug'
import { FullLogo } from '@root/graphics/FullLogo/index'
import Link from 'next/link'
import { useParams, useSelectedLayoutSegments } from 'next/navigation'
import React from 'react'

import classes from './index.module.scss'

export const DashboardBreadcrumbs = () => {
  let segments = useSelectedLayoutSegments()
  const params = useParams()

  const teamSlug = params['team-slug']
  const projectSlug = params['project-slug']

  const rootSegments = [
    ['cloud-terms', 'Terms'],
    ['login', 'Login'],
    ['logout', 'Logout'],
    ['new', 'New Project'],
    ['reset-password', 'Reset Password'],
    ['signup', 'Signup'],
    ['verify', 'Verify Email'],
  ]

  if (segments[0] === 'cloud') {
    if (segments.length === 2) {
      segments = []
    }
  }

  // remove segments with parantheses
  segments = segments.filter((segment) => !segment.includes('('))

  // create relative urls for each segment
  const urls = segments.map((segment, index) => {
    return segments.slice(0, index + 1).join('/')
  })

  for (const rootSegment of rootSegments) {
    if (segments[0] === rootSegment[0]) {
      segments[0] = rootSegment[1]
    }
  }

  // capitalize segments unless they are project or team slugs
  segments = segments.map((segment) => {
    if (segment === teamSlug || segment === projectSlug) {
      return segment
    }

    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  })

  return (
    <div className={classes.wrapper}>
      <Link className={classes.logo} href="/">
        <FullLogo />
      </Link>
      <div className={classes.breadcrumbs}>
        {segments[0] !== 'Cloud' ? (
          <React.Fragment>
            <span className={classes.slash}>{' / '}</span>
            <Link href={`/${cloudSlug}`}>Cloud</Link>
          </React.Fragment>
        ) : null}
        {segments.length === 0 && (
          <React.Fragment>
            <span className={classes.slash}>{' / '}</span>
            <span>Dashboard</span>
          </React.Fragment>
        )}
        {segments.map((segment, index) => {
          // removes env segment from breadcrumbs
          if (segment.toLowerCase() === 'env') {
            return
          }
          return (
            <React.Fragment key={segment}>
              <span className={classes.slash}>{' / '}</span>
              <Link href={`/${urls[index]}`}>{segment}</Link>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
