'use client'
import React, { createContext, useContext, useState } from 'react'

import { CodeBlip } from '@components/Code/types.js'

type CodeBlipContextType = {
  isOpen: boolean
  openModal: (blip: CodeBlip) => void
  closeModal: () => void
  data?: CodeBlip
}

export const Context = createContext<CodeBlipContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
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

  return (
    <Context.Provider value={{ data, isOpen, openModal, closeModal }}>{children}</Context.Provider>
  )
}

export const useCodeBlip = () => {
  const { data, isOpen, openModal, closeModal } = useContext(Context)

  return { data, isOpen, openModal, closeModal }
}
