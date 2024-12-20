'use client'

import { Modal } from '@faceless-ui/modal'
import * as React from 'react'

import classes from './index.module.scss'

type ModalWindowProps = {
  children: React.ReactNode
  className?: string
  slug: string
}
export const ModalWindow: React.FC<ModalWindowProps> = ({ slug, children, className }) => {
  return (
    <Modal className={[className, classes.modalWindow].filter(Boolean).join(' ')} slug={slug}>
      <div className={classes.window}>{children}</div>
    </Modal>
  )
}
