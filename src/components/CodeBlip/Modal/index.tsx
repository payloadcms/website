'use client'
import React, { useEffect, useId, useRef, useState } from 'react'
import { cubicBezier, motion, useAnimate } from 'framer-motion'

import { CMSLink } from '@components/CMSLink/index.js'
import { RichText } from '@components/RichText/index.js'
import { CloseIcon } from '@root/icons/CloseIcon/index.js'
import { useCodeBlip } from '../CodeBlipContext.js'

import classes from './index.module.scss'

const Modal: React.FC = ({}) => {
  const closeRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dialogRef, animate] = useAnimate()
  const { data, isOpen, closeModal } = useCodeBlip()

  const easing = cubicBezier(0.165, 0.84, 0.44, 1)

  // Ignoring additional dependencies because we don't want the useEffect to rerun on every ref
  useEffect(() => {
    if (isOpen) {
      animate(dialogRef.current, { opacity: 1 }, { duration: 0.35, ease: easing })

      if (containerRef.current)
        animate(containerRef.current, { x: 0 }, { duration: 0.35, ease: easing })
      if (closeRef.current)
        animate(closeRef.current, { transform: 'scale(1)' }, { duration: 0.15, ease: easing })

      closeRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleClose = () => {
    animate(dialogRef.current, { opacity: 0 }, { duration: 0.15, ease: easing }).then(closeModal)

    if (containerRef.current) animate(containerRef.current, { x: 20 })
    if (closeRef.current) animate(closeRef.current, { transform: 'scale(0)' })
  }

  return (
    <dialog
      style={{ opacity: 0 }}
      ref={dialogRef}
      open={isOpen}
      className={classes.modal}
      data-theme={'dark'}
    >
      <button
        ref={closeRef}
        style={{ transform: 'scale(0.5)' }}
        autoFocus
        onClick={handleClose}
        className={classes.close}
      >
        <span className="visually-hidden">Close</span>
        <CloseIcon />
      </button>
      {data && (
        <motion.div initial={{ x: 20 }} ref={containerRef} className={classes.container}>
          <div className={classes.label}>{data.label}</div>
          <RichText className={classes.richText} content={data.feature} />
          {data.enableLink && data.link && (
            <CMSLink {...data.link} appearance={'text'} buttonProps={{ icon: 'arrow' }} />
          )}
        </motion.div>
      )}
    </dialog>
  )
}

export default Modal
