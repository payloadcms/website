import React, { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleToggler } from '@faceless-ui/collapsibles'
import Link from 'next/link'

import { LineBlip } from '@components/LineBlip'
import { ArrowIcon } from '@root/icons/ArrowIcon'

import classes from './index.module.scss'

export type Props = {
  className?: string
}

export const RelatedDiscordGitList: React.FC<Props> = () => {
  const [scrollTopRestoreValue, setScrollTopRestoreValue] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className={classes.relatedDiscordGitList}>
      <div className={classes.titleWrapper}>
        <h4 className={classes.title}>Related Threads</h4>
      </div>
      <Collapsible transTime={350} transCurve="ease-in" initialHeight={200}>
        {({ isOpen }) => (
          <div>
            <CollapsibleContent>
              <ul>
                <li>
                  <Link href={`/community-help`}>Dynamic description</Link>
                </li>
                <li>
                  <Link href={`/community-help`}>Payload + Gatsby</Link>
                </li>
                <li>
                  <Link href={`/community-help`}>
                    Bulk editing incorrectly setting all slug fields to the same value
                  </Link>
                </li>
                <li>
                  <Link href={`/community-help`}>Unable to specify depth</Link>
                </li>
                <li>
                  <Link href={`/community-help`}>REST API - Basic Auth</Link>
                </li>
                <li>
                  <Link href={`/community-help`}>disable a user</Link>
                </li>
                <li>
                  <Link href={`/community-help`}>
                    Are we able to sort by a related document's field with the REST API?
                  </Link>
                </li>
                <li>
                  <Link href={`/community-help`}>
                    error TypeError: Failed to parse URL from undefined/api/graphql?page=home
                  </Link>
                </li>
                <li>
                  <Link href={`/community-help`}>
                    Specify where payload can find payload.config.ts
                  </Link>
                </li>
              </ul>
            </CollapsibleContent>
            <CollapsibleToggler
              className={[classes.collapsibleToggler, isOpen && classes.togglerOpen]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                if (!isOpen) {
                  setScrollTopRestoreValue(window.scrollY)
                } else if (isOpen) {
                  window.scrollTo({
                    top: scrollTopRestoreValue,
                    behavior: 'auto',
                  })
                }
              }}
              onMouseEnter={() => {
                setIsHovered(true)
              }}
              onMouseLeave={() => {
                setIsHovered(false)
              }}
            >
              <LineBlip active={isHovered} />

              <div className={classes.togglerContent}>
                <div className={classes.togglerLabel}>{isOpen ? 'Hide threads' : 'See more'}</div>
                <ArrowIcon
                  className={[classes.inputArrow, isOpen && classes.isOpenArrow]
                    .filter(Boolean)
                    .join(' ')}
                />
              </div>
            </CollapsibleToggler>
          </div>
        )}
      </Collapsible>
    </div>
  )
}
