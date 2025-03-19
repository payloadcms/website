'use client'

import type { StaticImageData } from 'next/image'

import NextImage from 'next/image'
import React, { useState } from 'react'

import type { Props } from '../types'

import cssVariables from '../../../../cssVariables.cjs'
import classes from './index.module.scss'

const { breakpoints } = cssVariables

export const Image: React.FC<Props> = (props) => {
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

  const [isLoading, setIsLoading] = useState(true)

  let width: null | number | undefined = widthFromProps
  let height: null | number | undefined = heightFromProps
  let alt = altFromProps
  let src: null | StaticImageData | string | undefined = srcFromProps

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
