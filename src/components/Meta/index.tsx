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
  const image =
    typeof imageFromProps !== 'string' && imageFromProps?.url ? imageFromProps.url : defaults.image

  return (
    <Fragment>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}${slug}`} />
      <meta property="og:site_name" content="Payload CMS" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:type" content="website" />
    </Fragment>
  )
}

export default Meta
