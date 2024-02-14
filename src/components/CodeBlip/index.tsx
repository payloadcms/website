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

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

const CodeBlip: React.FC<{ blip: CodeBlip; delay?: number }> = ({
  blip,
  delay: delayFromProps = 0,
}) => {
  const [active, setActive] = useState(false)
  const { openModal } = useCodeBlip()

  const delay = `${getRandomInt(1000, 7000)}ms`

  const style = { '--animation-delay': delay } as React.CSSProperties

  return (
    <>
      <button onClick={() => openModal()} className={classes.button} style={style}>
        <span className="visually-hidden">Code feature</span>
        <InfoIcon />
        <GradientBorderIcon className={classes.border} />
        <GradientBorderIcon className={classes.pulse} />
      </button>
    </>
  )
}

export default CodeBlip
