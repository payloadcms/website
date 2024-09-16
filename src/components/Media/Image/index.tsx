'use client'

import React, { useState } from 'react'
import NextImage from 'next/image'

import type { StaticImageData } from 'next/image'

import cssVariables from '../../../../cssVariables.cjs'
import { Props } from '../types.js'

import classes from './index.module.scss'

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
    width: widthFromProps,
    height: heightFromProps,
  } = props

  const [isLoading, setIsLoading] = useState(true)

  let width: number | undefined | null = widthFromProps
  let height: number | undefined | null = heightFromProps
  let alt = altFromProps
  let src: StaticImageData | string | undefined | null = srcFromProps

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
        className={`${baseClasses} ${classes.themeLight}`}
        src={src || ''}
        alt={alt || ''}
        onClick={onClick}
        onLoad={() => {
          setIsLoading(false)
          if (typeof onLoadFromProps === 'function') {
            onLoadFromProps()
          }
        }}
        fill={fill}
        width={!fill ? width ?? undefined : undefined}
        height={!fill ? height ?? undefined : undefined}
        sizes={sizes}
        priority={priority}
        quality={90}
      />
      {hasDarkModeFallback &&
        typeof resource.darkModeFallback === 'object' &&
        resource.darkModeFallback !== null && (
          <NextImage
            className={`${baseClasses} ${classes.themeDark}`}
            src={resource.darkModeFallback.url || ''}
            alt={alt || ''}
            onClick={onClick}
            onLoad={() => {
              setIsLoading(false)
              if (typeof onLoadFromProps === 'function') {
                onLoadFromProps()
              }
            }}
            fill={fill}
            width={!fill ? width ?? undefined : undefined}
            height={!fill ? height ?? undefined : undefined}
            sizes={sizes}
            priority={priority}
            quality={90}
          />
        )}
    </React.Fragment>
  )
}
