import React, { useEffect, useId, useRef, useState } from 'react'
import { useAnimate, usePresence } from 'framer-motion'

import { RichText } from '@components/RichText'
import { CloseIcon } from '@root/icons/CloseIcon'
import { useCodeBlip } from '../CodeBlipContext'

import classes from './index.module.scss'

const Modal: React.FC = ({}) => {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [dialogRef, animate] = useAnimate()
  const { data, isOpen, closeModal } = useCodeBlip()

  useEffect(() => {
    if (isOpen) {
      animate(dialogRef.current, { opacity: 1 })
      closeRef.current?.focus()
    }
  }, [isOpen])

  const handleClose = () => {
    animate(dialogRef.current, { opacity: 0 }).then(closeModal)
  }

  return (
    <dialog style={{ opacity: 0 }} ref={dialogRef} open={isOpen} className={classes.modal}>
      <button ref={closeRef} autoFocus onClick={handleClose} className={classes.close}>
        <span className="visually-hidden">Close</span>
        <CloseIcon />
      </button>
      {data && (
        <div className={classes.container}>
          <div className={classes.label}>{data.label}</div>
          <RichText content={data.feature} />
        </div>
      )}
    </dialog>
  )
}

export default Modal
