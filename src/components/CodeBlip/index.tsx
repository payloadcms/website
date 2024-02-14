'use client'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { animate, motion, transform, useInView, useScroll } from 'framer-motion'

import { RichText } from '@components/RichText'
import { GradientBorderIcon } from '@root/icons/GradientBorderIcon'
import { InfoIcon } from '@root/icons/InfoIcon'
import { CodeBlip, Props } from '../Code/types'

import classes from './index.module.scss'

type CodeBlipContextType = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const CodeBlipContext = createContext<CodeBlipContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
})

export const CodeBlipProvider: React.FC<any> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <CodeBlipContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </CodeBlipContext.Provider>
  )
}

export const useCodeBlip = () => {
  const { isOpen, openModal, closeModal } = useContext(CodeBlipContext)

  return { isOpen, openModal, closeModal }
}

const CodeBlip: React.FC<{ blip: CodeBlip }> = ({ blip }) => {
  const [active, setActive] = useState(false)
  const { openModal } = useCodeBlip()

  return (
    <>
      <button onClick={() => openModal()} className={classes.button}>
        <span className="visually-hidden">Code feature</span>
        <InfoIcon />
        <GradientBorderIcon className={classes.border} />
        <GradientBorderIcon className={classes.pulse} />
      </button>
      <div className={classes.codeFeature}>
        <div className={[classes.content, active && classes.active].filter(Boolean).join(' ')}>
          <RichText content={blip.feature} />
        </div>
      </div>
    </>
  )
}

export default CodeBlip
