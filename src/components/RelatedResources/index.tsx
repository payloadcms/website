import * as Accordion from '@radix-ui/react-accordion'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import Link from 'next/link'

import classes from './index.module.scss'
import { CommunityHelp, Post } from '@root/payload-types'
import { ChevronIcon } from '@icons/ChevronIcon'

type RelatedResourcesProps = {
  guides?: (string | Partial<Post>)[]
  relatedThreads?: (string | Partial<CommunityHelp>)[]
}

export const RelatedResources: React.FC<RelatedResourcesProps> = ({ guides, relatedThreads }) => {
  const hasGuides = guides && Array.isArray(guides) && guides.length > 0
  const hasRelatedThreads =
    relatedThreads && Array.isArray(relatedThreads) && relatedThreads.length > 0

  return (
    <div className={classes.resources}>
      <Accordion.Root type="multiple" defaultValue={['guides', 'threads']}>
        {hasGuides && (
          <Accordion.Item value="guides">
            <Accordion.Trigger asChild>
              <div className={classes.listHeader}>
                <h4>Related Guides</h4> <ChevronIcon className={classes.chevron} />
              </div>
            </Accordion.Trigger>
            <Accordion.Content asChild>
              <ul className={classes.list}>
                {guides.map(
                  (guide) =>
                    typeof guide !== 'string' &&
                    typeof guide.category !== 'string' && (
                      <li key={guide.slug} className={classes.item}>
                        <Link href={`/guides/${guide.slug}`} prefetch={false}>
                          {guide.title} <ArrowIcon className={classes.relatedPostsArrow} />
                        </Link>
                      </li>
                    ),
                )}
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
                      <li key={thread.slug} className={classes.item}>
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
