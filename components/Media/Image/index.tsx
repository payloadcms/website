import React from 'react'
import NextImage, { StaticImageData } from 'next/image'
import classes from './index.module.scss'
import cssVariables from '../../../cssVariables'
import { Props } from '../types'

const { breakpoints } = cssVariables

export const Image: React.FC<Props> = props => {
  const {
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    sizes: sizesFromProps,
    resource,
    priority,
    fill,
    src: srcFromProps,
    alt: altFromProps,
  } = props

  const [isLoading, setIsLoading] = React.useState(true)

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps

  const hasDarkModeFallback =
    resource?.darkModeFallback &&
    typeof resource.darkModeFallback === 'object' &&
    typeof resource.darkModeFallback.filename === 'string'

  if (!src && resource && typeof resource !== 'string') {
    width = resource.width
    height = resource.height
    alt = resource.alt
    src = `${process.env.NEXT_PUBLIC_CMS_URL}/media/${resource.filename}`
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes =
    sizesFromProps ||
    Object.entries(breakpoints)
      .map(([, value]) => `(max-width: ${value}px) ${value}px`)
      .join(', ')

  const baseClasses = [
    isLoading && classes.placeholder,
    classes.image,
    imgClassName,
    hasDarkModeFallback && classes.hasDarkModeFallback,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <React.Fragment>
      <NextImage
        className={`${baseClasses} ${classes.themeLight}`}
        src={src}
        alt={alt}
        onClick={onClick}
        onLoad={() => {
          setIsLoading(false)
          if (typeof onLoadFromProps === 'function') {
            onLoadFromProps()
          }
        }}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
      />
      {hasDarkModeFallback && typeof resource.darkModeFallback === 'object' && (
        <NextImage
          className={`${baseClasses} ${classes.themeDark}`}
          src={`${process.env.NEXT_PUBLIC_CMS_URL}/media/${resource.darkModeFallback.filename}`}
          alt={alt}
          onClick={onClick}
          onLoad={() => {
            setIsLoading(false)
            if (typeof onLoadFromProps === 'function') {
              onLoadFromProps()
            }
          }}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          sizes={sizes}
          priority={priority}
        />
      )}
    </React.Fragment>
  )
}
