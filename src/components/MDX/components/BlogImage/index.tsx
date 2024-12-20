import React from 'react'

import classes from './index.module.scss'

const BlogImage: (props: {
  alt: string
  caption?: string
  className?: string
  disableShadow?: boolean
  src: string
}) => React.JSX.Element = ({ alt, caption, disableShadow = false, src }) => (
  <div className={[classes.blogImage, !disableShadow && classes.shadow].filter(Boolean).join(' ')}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img alt={alt} className={classes.img} src={src} />
    {caption && <div className={classes.caption}>{caption}</div>}
  </div>
)

export default BlogImage
