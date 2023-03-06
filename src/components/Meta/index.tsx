import React, { Fragment } from 'react'
import { Media } from '@root/payload-types'

export type MetaType = {
  image?: Media | string
  description: string
  title: string
  slug: string
}

const defaults = {
  title: 'Payload CMS | Node & React TypeScript Headless CMS',
  description:
    'Headless CMS and application framework built with TypeScript, Node.js, React and MongoDB',
  image: 'https://payloadcms.com/images/og-image.jpg',
}

const Meta: React.FC<MetaType> = ({
  title: titleFromProps,
  description: descriptionFromProps,
  image: imageFromProps,
  slug,
}) => {
  const title = titleFromProps || defaults.title
  const description = descriptionFromProps || defaults.description
  let image = defaults.image

  if (imageFromProps) {
    if (typeof imageFromProps !== 'string' && imageFromProps?.url) {
      image = `${process.env.NEXT_PUBLIC_CMS_URL}${imageFromProps.url}`
    } else {
      image = String(imageFromProps)
    }
  }

  return (
    <Fragment>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={`https://payloadcms.com/${slug}`} />
      <meta property="og:site_name" content="Payload CMS" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:type" content="website" />
    </Fragment>
  )
}

export default Meta
