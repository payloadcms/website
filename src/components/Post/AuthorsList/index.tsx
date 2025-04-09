import type { Post } from '@root/payload-types'

import { GuestSocials } from '@components/GuestSocials'
import { Label } from '@components/Label/index'
import { Media } from '@components/Media/index'
import Link from 'next/link'
import { Fragment } from 'react'

import classes from './index.module.scss'

const AuthorContent: React.FC<{
  author: NonNullable<Post['authors']>[0]
}> = (props) => {
  const { author } = props

  if (!author || typeof author === 'string') {
    return null
  }

  return (
    <div className={classes.author}>
      {author?.photo && typeof author?.photo !== 'string' && (
        <Media className={classes.authorImage} resource={author?.photo} />
      )}
      <div className={classes.authorInfo}>
        <span>{`${author?.firstName || 'Unknown'} ${author?.lastName || 'Author'}`}</span>
        {author?.twitter && <div className={classes.twitter}>{`@${author?.twitter}`}</div>}
      </div>
    </div>
  )
}

export const AuthorsList: React.FC<{
  authors: Post['authors']
}> = (props) => {
  const { authors } = props

  if (!authors || authors?.length === 0) {
    return null
  }

  return (
    <div className={classes.authorSlot}>
      <span className={classes.authorLabel}>Author{authors.length > 1 && 's'}</span>
      {authors?.map((author, index) => (
        <Fragment key={index}>
          {author && typeof author !== 'string' && (
            <Fragment>
              {author?.twitter ? (
                <Link
                  className={classes.authorLink}
                  href={`https://twitter.com/${author?.twitter}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <AuthorContent author={author} />
                </Link>
              ) : (
                <AuthorContent author={author} />
              )}
            </Fragment>
          )}
        </Fragment>
      ))}
    </div>
  )
}

export const GuestAuthorList: React.FC<{
  author?: Post['guestAuthor']
  socials?: Post['guestSocials']
}> = (props) => {
  const { author, socials } = props

  if (!author) {
    return null
  }

  return (
    <div className={classes.authorSlot}>
      <span className={classes.authorLabel}>Author</span>
      <span>{author}</span>
      <div className={classes.guestSocials}>
        {socials && <GuestSocials guestSocials={socials} />}
      </div>
    </div>
  )
}
