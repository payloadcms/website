'use client'

import type { MediaProps } from '@components/Media/types'
import type { StaticImageData } from 'next/image'

import { standardSizes } from '@utilities/image-sizes'
import NextImage from 'next/image'
import React from 'react'

import classes from './index.module.scss'

export const Image: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    height: heightFromProps,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority,
    resource,
    sizes: sizesFromProps,
    src: srcFromProps,
    width: widthFromProps,
  } = props

  const [isLoading, setIsLoading] = React.useState(true)

  let width: null | number | undefined = widthFromProps
  let height: null | number | undefined = heightFromProps
  let alt = altFromProps
  let src: null | StaticImageData | string | undefined = srcFromProps
  const sizes = sizesFromProps || standardSizes

  const hasDarkModeFallback =
    resource?.darkModeFallback &&
    typeof resource.darkModeFallback === 'object' &&
    resource.darkModeFallback !== null &&
    typeof resource.darkModeFallback.filename === 'string'

  if (!src && resource && typeof resource !== 'string') {
    width = resource.width
    height = resource.height
    alt = resource.alt
    src = resource.url
  }

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
        alt={alt || ''}
        className={`${baseClasses} ${classes.themeLight}`}
        fill={fill}
        height={!fill ? (height ?? undefined) : undefined}
        onClick={onClick}
        onLoad={() => {
          setIsLoading(false)
          if (typeof onLoadFromProps === 'function') {
            onLoadFromProps()
          }
        }}
        priority={priority}
        quality={90}
        sizes={sizes}
        src={src || ''}
        width={!fill ? (width ?? undefined) : undefined}
      />
      {hasDarkModeFallback &&
        typeof resource.darkModeFallback === 'object' &&
        resource.darkModeFallback !== null && (
          <NextImage
            alt={alt || ''}
            className={`${baseClasses} ${classes.themeDark}`}
            fill={fill}
            height={!fill ? (height ?? undefined) : undefined}
            onClick={onClick}
            onLoad={() => {
              setIsLoading(false)
              if (typeof onLoadFromProps === 'function') {
                onLoadFromProps()
              }
            }}
            priority={priority}
            quality={90}
            sizes={sizes}
            src={resource.darkModeFallback.url || ''}
            width={!fill ? (width ?? undefined) : undefined}
          />
        )}
    </React.Fragment>
  )
}
