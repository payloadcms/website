import React, { Fragment } from 'react'
import { Media } from '@root/payload-types'

export type MetaType = {
  image: Media | string
  description: string
  title: string
  slug: string
}

const defaults = {
  title: 'Payload CMS',
  description: 'The most powerful TypeScript CMS.',
}

const Meta: React.FC<MetaType> = ({
  title: titleFromProps,
  description: descriptionFromProps,
  image,
  slug,
}) => {
  const title = titleFromProps || defaults.title
  const description = descriptionFromProps || defaults.description

  return (
    <Fragment>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      {typeof image !== 'string' && image?.url && <meta property="og:image" content={image.url} />}
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}${slug}`} />
      <meta property="og:site_name" content="BioLogos" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:type" content="website" />
      <link rel="shortcut icon" href="/favicon.png" type="image/png" />
    </Fragment>
  )
}

export default Meta
