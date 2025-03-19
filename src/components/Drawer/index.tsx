'use client'
import { Modal, useModal } from '@faceless-ui/modal'
import { CloseIcon } from '@root/icons/CloseIcon/index'
import React, { useCallback, useEffect, useState } from 'react'

import type { Props, TogglerProps } from './types'

import classes from './index.module.scss'

export const formatDrawerSlug = ({ slug }: { slug: string }): string => `drawer_${slug}`

export const DrawerToggler: React.FC<TogglerProps> = ({
  slug,
  children,
  className,
  disabled,
  onClick,
  ...rest
}) => {
  const { openModal } = useModal()

  const handleClick = useCallback(
    (e) => {
      openModal(slug)
      if (typeof onClick === 'function') {
        onClick(e)
      }
    },
    [openModal, slug, onClick],
  )

  return (
    <button className={className} disabled={disabled} onClick={handleClick} type="button" {...rest}>
      {children}
    </button>
  )
}

export const Drawer: React.FC<Props> = ({
  slug,
  children,
  className,
  description,
  header,
  size = 'l',
  title,
}) => {
  const { closeModal, modalState } = useModal()
  const [isOpen, setIsOpen] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    setIsOpen(modalState[slug]?.isOpen)
  }, [slug, modalState])

  useEffect(() => {
    setAnimateIn(isOpen)
  }, [isOpen])

  if (isOpen) {
    return (
      <Modal
        className={[
          className,
          classes.drawer,
          animateIn && classes.isOpen,
          size && classes[`size-${size}`],
        ]
          .filter(Boolean)
          .join(' ')}
        slug={slug}
      >
        <div className={classes.blurBG} />
        <button
          aria-label="Close"
          className={classes.close}
          id={`close-drawer__${slug}`}
          onClick={() => closeModal(slug)}
          type="button"
        />
        <div className={classes.content}>
          <div className={classes.contentChildren}>
            {header && header}
            {header === undefined && (
              <div className={classes.header}>
                <div className={classes.headerContent}>
                  {title && <h3 className={classes.title}>{title}</h3>}
                  {description && <p className={classes.description}>{description}</p>}
                </div>
                <button
                  aria-label="Close"
                  className={classes.headerClose}
                  id={`close-drawer__${slug}`}
                  onClick={() => closeModal(slug)}
                  type="button"
                >
                  <CloseIcon size="large" />
                </button>
              </div>
            )}
            {children}
          </div>
        </div>
      </Modal>
    )
  }

  return null
}
