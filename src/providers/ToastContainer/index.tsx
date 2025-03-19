'use client'
import React from 'react'
import { Toaster } from 'sonner'

import { Error } from './icons/Error'
import { Info } from './icons/Info'
import { Success } from './icons/Success'
import { Warning } from './icons/Warning'

export function ToastContainer() {
  return (
    <Toaster
      className="payload-toast-container"
      closeButton
      // @ts-expect-error
      dir="undefined"
      gap={8}
      // icons={{
      //   error: <Error />,
      //   info: <Info />,
      //   success: <Success />,
      //   warning: <Warning />,
      // }}
      offset="calc(var(--gutter-h) / 4)"
      toastOptions={{
        classNames: {
          closeButton: 'payload-toast-close-button',
          content: 'toast-content',
          error: 'toast-error',
          icon: 'toast-icon',
          info: 'toast-info',
          success: 'toast-success',
          title: 'toast-title',
          toast: 'payload-toast-item',
          warning: 'toast-warning',
        },
        unstyled: true,
      }}
      visibleToasts={5}
    />
  )
}
