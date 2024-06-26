import { Fragment } from 'react'
import Link from 'next/link'

import { Label } from '@components/Label/index.js'
import { Media } from '@components/Media/index.js'
import { Post } from '@root/payload-types.js'

import classes from './index.module.scss'

const AuthorContent: React.FC<{
  author: Post['authors'][0]
}> = props => {
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
}> = props => {
  const { authors } = props

  if (!authors || authors?.length === 0) {
    return null
  }

  return (
    <div className={classes.authorSlot}>
      <span className={classes.label}>Author{`${authors.length > 1 ? 's' : ''}`}</span>
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
