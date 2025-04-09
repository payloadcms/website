import type { CommunityHelp, Post } from '@root/payload-types'

import { ChevronIcon } from '@icons/ChevronIcon'
import * as Accordion from '@radix-ui/react-accordion'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import Link from 'next/link'

import classes from './index.module.scss'

type RelatedResourcesProps = {
  guides?: (Partial<Post> | string)[]
  relatedThreads?: (Partial<CommunityHelp> | string)[]
}

export const RelatedResources: React.FC<RelatedResourcesProps> = ({ guides, relatedThreads }) => {
  const hasGuides = guides && Array.isArray(guides) && guides.length > 0
  const hasRelatedThreads =
    relatedThreads && Array.isArray(relatedThreads) && relatedThreads.length > 0

  return (
    <div className={classes.resources}>
      <Accordion.Root defaultValue={['guides', 'threads']} type="multiple">
        {hasGuides && (
          <Accordion.Item value="guides">
            <Accordion.Trigger asChild>
              <div className={classes.listHeader}>
                <h4>Related Guides</h4> <ChevronIcon className={classes.chevron} />
              </div>
            </Accordion.Trigger>
            <Accordion.Content asChild>
              <ul className={classes.list}>
                {guides.map((guide) => {
                  return (
                    typeof guide !== 'string' && (
                      <li className={classes.item} key={guide.slug}>
                        <Link href={`/posts/guides/${guide.slug}`} prefetch={false}>
                          {guide.title} <ArrowIcon className={classes.relatedPostsArrow} />
                        </Link>
                      </li>
                    )
                  )
                })}
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        )}
        {hasRelatedThreads && (
          <Accordion.Item value="threads">
            <Accordion.Trigger asChild>
              <h4>Community Help Threads</h4>
            </Accordion.Trigger>
            <Accordion.Content asChild>
              <ul className={classes.list}>
                {relatedThreads.map(
                  (thread) =>
                    typeof thread !== 'string' && (
                      <li className={classes.item} key={thread.slug}>
                        <Link href={`/community-help/${thread.communityHelpType}/${thread.slug}`}>
                          {thread.title} <ArrowIcon className={classes.relatedPostsArrow} />
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        )}
      </Accordion.Root>
    </div>
  )
}
