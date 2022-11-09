import React from 'react'
import classes from './index.module.scss'

const BlogImage: React.FC<{
  className?: string
  src: string
  alt: string
  caption?: string
  disableShadow?: boolean
}> = ({ src, alt, caption, disableShadow = false }) => (
  <div className={[classes.blogImage, !disableShadow && classes.shadow].filter(Boolean).join(' ')}>
    <img className={classes.img} src={src} alt={alt} />
    {caption && <div className={classes.caption}>{caption}</div>}
  </div>
)

export default BlogImage
