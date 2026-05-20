'use client'

import type { Page } from '@root/payload-types'
import type { HTMLAttributes } from 'react'

import { CopyIcon } from '@icons/CopyIcon/index'
import { GitHubIcon } from '@root/graphics/GitHub/index'
import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import { LoaderIcon } from '@root/icons/LoaderIcon/index'
import { PlusIcon } from '@root/icons/PlusIcon/index'
import { SearchIcon } from '@root/icons/SearchIcon/index'
import Link from 'next/link'
import React, { forwardRef, useEffect, useState } from 'react'
// eslint-disable-next-line import/no-cycle
import type { LinkType, Reference } from '../CMSLink/index'

import classes from './index.module.scss'

export type ButtonProps = {
  appearance?:
    | 'danger'
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'text'
    | 'warning'
    | null
  arrowClassName?: string
  customId?: null | string
  disabled?: boolean
  el?: 'a' | 'button' | 'div' | 'link'
  /**
   * Forces a background on the default button appearance
   */
  forceBackground?: boolean
  fullWidth?: boolean
  /**
   * Hides all borders
   */
  hideBorders?: boolean
  /**
   * Hides the bottom border except for the last of type
   */
  hideBottomBorderExceptLast?: boolean
  /**
   * Hides the horizontal borders of the button, useful for buttons in grids
   */
  hideHorizontalBorders?: boolean
  /**
   * Hides the horizontal borders of the button
   */
  hideVerticalBorders?: boolean
  href?: null | string
  htmlButtonType?: 'button' | 'submit'
  icon?: 'arrow' | 'copy' | 'github' | 'loading' | 'plus' | 'search' | false
  iconRotation?: number
  iconSize?: 'large' | 'medium' | 'small' | undefined
  isCMSFormSubmitButton?: boolean
  label?: null | string
  labelClassName?: string
  labelStyle?: 'mono' | 'regular'
  mobileFullWidth?: boolean
  newTab?: boolean | null
  reference?: Reference
  size?: 'default' | 'large' | 'pill'
  type?: LinkType
  url?: null | string
} & HTMLAttributes<HTMLButtonElement>

const icons = {
  arrow: ArrowIcon,
  copy: CopyIcon,
  github: GitHubIcon,
  loading: LoaderIcon,
  plus: PlusIcon,
  search: SearchIcon,
}

type GenerateSlugType = {
  reference?: Reference
  type?: LinkType
  url?: null | string
}
const generateHref = (args: GenerateSlugType): string => {
  const { type, reference, url } = args

  if ((type === 'custom' || type === undefined) && url) {
    return url
  }

  if (type === 'reference' && reference?.value && typeof reference.value !== 'string') {
    if (reference.relationTo === 'pages') {
      const value = reference.value as Page
      const breadcrumbs = value?.breadcrumbs
      const hasBreadcrumbs = breadcrumbs && Array.isArray(breadcrumbs) && breadcrumbs.length > 0
      if (hasBreadcrumbs) {
        return breadcrumbs[breadcrumbs.length - 1]?.url as string
      }
    }

    if (reference.relationTo === 'posts') {
      return `/blog/${reference.value.slug}`
    }

    if (reference.relationTo === 'case_studies') {
      return `/case-studies/${reference.value.slug}`
    }

    return `/${reference.relationTo}/${reference.value.slug}`
  }

  return ''
}

const ButtonContent: React.FC<ButtonProps> = (props) => {
  const {
    appearance,
    arrowClassName,
    icon,
    iconRotation,
    iconSize,
    isCMSFormSubmitButton,
    label,
    labelClassName,
    labelStyle = 'mono',
    size,
  } = props

  const Icon = icon ? icons[icon] : null

  const iconProps = {
    rotation: icon === 'arrow' ? iconRotation : undefined,
    size: iconSize,
  }

  if (appearance === 'default') {
    return (
      <div className={[classes.contentWrapper].filter(Boolean).join(' ')}>
        <div
          className={[
            classes.content,
            classes.defaultLabel,
            isCMSFormSubmitButton && classes.cmsFormSubmitButtonContent,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {label && (
            <div
              className={[
                classes.label,
                !icon && classes['label-centered'],
                classes[`label-${labelStyle}`],
                labelClassName,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {label}
            </div>
          )}
          {Icon && label && <div className={classes.spacer} />}
          {Icon && (
            <Icon
              className={[classes.icon, arrowClassName, classes[`icon--${icon}`]]
                .filter(Boolean)
                .join(' ')}
              {...iconProps}
            />
          )}
        </div>
        <div
          aria-hidden={true}
          className={[
            classes.content,
            classes.hoverLabel,
            isCMSFormSubmitButton && classes.cmsFormSubmitButtonContent,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {label && (
            <div
              className={[
                classes.label,
                !icon && classes['label-centered'],
                classes[`label-${labelStyle}`],
                labelClassName,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {label}
            </div>
          )}
          {Icon && label && <div className={classes.spacer} />}
          {Icon && (
            <Icon
              className={[classes.icon, arrowClassName, classes[`icon--${icon}`]]
                .filter(Boolean)
                .join(' ')}
              {...iconProps}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={classes.content}>
      {label && (
        <div
          className={[
            classes.label,
            !icon && classes['label-centered'],
            classes[`label-${labelStyle}`],
            labelClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {label}
        </div>
      )}
      {Icon && label && <div className={classes.spacer} />}
      {Icon && (
        <Icon
          className={[classes.icon, classes[`icon--${icon}`]].filter(Boolean).join(' ')}
          {...iconProps}
        />
      )}
    </div>
  )
}

const elements: {
  [key: string]: React.ElementType
} = {
  a: 'a',
  button: 'button',
  div: 'div',
}

export const Button = ({
  ref,
  ...props
}: { ref?: React.RefObject<HTMLButtonElement | null> } & ButtonProps) => {
  const {
    id,
    type,
    appearance = 'default',
    arrowClassName,
    className: classNameFromProps,
    disabled,
    el = 'button',
    forceBackground,
    fullWidth,
    hideBorders,
    hideBottomBorderExceptLast,
    hideHorizontalBorders,
    hideVerticalBorders,
    href: hrefFromProps,
    htmlButtonType = 'button',
    isCMSFormSubmitButton,
    labelClassName,
    mobileFullWidth,
    newTab,
    onClick,
    reference,
    size = 'default',
    url,
  } = props

  const href = hrefFromProps || generateHref({ type, reference, url })
  const [isHovered, setIsHovered] = useState(false)

  const [isAnimating, setIsAnimating] = useState(false)
  const [isAnimatingIn, setIsAnimatingIn] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  const animationDuration = 550

  useEffect(() => {
    let inTimer, outTimer

    if (isHovered) {
      setIsAnimating(true)
      setIsAnimatingIn(true)

      inTimer = setTimeout(() => {
        setIsAnimating(false)
        setIsAnimatingIn(false)
      }, animationDuration)

      setIsAnimatingOut(false)
    } else {
      setIsAnimating(true)
      setIsAnimatingIn(false)
      setIsAnimatingOut(true)

      outTimer = setTimeout(() => {
        setIsAnimating(false)
        setIsAnimatingOut(false)
      }, animationDuration)
    }

    return () => {
      clearTimeout(inTimer)
      clearTimeout(outTimer)
    }
  }, [isHovered, animationDuration])

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  const className = [
    classNameFromProps,
    classes.button,
    classes[`appearance--${appearance}`],
    fullWidth && classes['full-width'],
    mobileFullWidth && classes['mobile-full-width'],
    size && classes[`size--${size}`],
    isHovered && classes.isHovered,
    isAnimatingIn && classes.isAnimatingIn,
    isAnimatingOut && classes.animatingOut,
    isAnimating && classes.isAnimating,
    hideHorizontalBorders && classes.hideHorizontalBorders,
    hideVerticalBorders && classes.hideVerticalBorders,
    hideBorders && classes.hideBorders,
    hideBottomBorderExceptLast && classes.hideBottomBorderExceptLast,
    forceBackground && classes.forceBackground,
  ]
    .filter(Boolean)
    .join(' ')

  if (el === 'link') {
    return (
      <Link href={href} legacyBehavior passHref prefetch={false}>
        <a
          className={className}
          {...newTabProps}
          id={id}
          onMouseEnter={() => {
            setIsHovered(true)
          }}
          onMouseLeave={() => {
            setIsHovered(false)
          }}
        >
          <ButtonContent {...props} />
        </a>
      </Link>
    )
  }

  const Element = elements[el]

  if (Element) {
    return (
      <Element
        className={className}
        ref={ref}
        type={htmlButtonType}
        {...newTabProps}
        disabled={disabled}
        href={href || null}
        id={id}
        onClick={onClick}
        onMouseEnter={() => {
          setIsHovered(true)
        }}
        onMouseLeave={() => {
          setIsHovered(false)
        }}
      >
        <ButtonContent appearance={appearance} {...props} />
      </Element>
    )
  }

  return null
}
