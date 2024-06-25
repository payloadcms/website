'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Modal, useModal } from '@faceless-ui/modal'

import { CloseIcon } from '@root/icons/CloseIcon/index.js'
import { Props, TogglerProps } from './types.js'

import classes from './index.module.scss'

export const formatDrawerSlug = ({ slug }: { slug: string }): string => `drawer_${slug}`

export const DrawerToggler: React.FC<TogglerProps> = ({
  slug,
  children,
  className,
  onClick,
  disabled,
  ...rest
}) => {
  const { openModal } = useModal()

  const handleClick = useCallback(
    e => {
      openModal(slug)
      if (typeof onClick === 'function') onClick(e)
    },
    [openModal, slug, onClick],
  )

  return (
    <button onClick={handleClick} type="button" className={className} disabled={disabled} {...rest}>
      {children}
    </button>
  )
}

export const Drawer: React.FC<Props> = ({
  slug,
  children,
  className,
  header,
  title,
  description,
  size = 'l',
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
        slug={slug}
        className={[
          className,
          classes.drawer,
          animateIn && classes.isOpen,
          size && classes[`size-${size}`],
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={classes.blurBG} />
        <button
          className={classes.close}
          id={`close-drawer__${slug}`}
          type="button"
          onClick={() => closeModal(slug)}
          aria-label="Close"
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
                  className={classes.headerClose}
                  id={`close-drawer__${slug}`}
                  type="button"
                  onClick={() => closeModal(slug)}
                  aria-label="Close"
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
