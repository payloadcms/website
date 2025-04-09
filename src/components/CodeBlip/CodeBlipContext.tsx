'use client'
import type { CodeBlip } from '@components/Code/types'

import React, { createContext, use, useState } from 'react'

type CodeBlipContextType = {
  closeModal: () => void
  data?: CodeBlip
  isOpen: boolean
  openModal: (blip: CodeBlip) => void
}

export const Context = createContext<CodeBlipContextType>({
  closeModal: () => {},
  isOpen: false,
  openModal: () => {},
})

export const Provider: React.FC<any> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<CodeBlip>()

  const openModal = (blip: CodeBlip) => {
    setIsOpen(true)
    setData(blip)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return <Context value={{ closeModal, data, isOpen, openModal }}>{children}</Context>
}

export const useCodeBlip = () => {
  const { closeModal, data, isOpen, openModal } = use(Context)

  return { closeModal, data, isOpen, openModal }
}
