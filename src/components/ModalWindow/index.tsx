'use client'

import * as React from 'react'
import { Modal } from '@faceless-ui/modal'

import classes from './index.module.scss'

type ModalWindowProps = {
  slug: string
  children: React.ReactNode
  className?: string
}
export const ModalWindow: React.FC<ModalWindowProps> = ({ children, slug, className }) => {
  return (
    <Modal slug={slug} className={[className, classes.modalWindow].filter(Boolean).join(' ')}>
      <div className={classes.window}>{children}</div>
    </Modal>
  )
}
