'use client'

import { useEffect } from 'react'

import { PopupMessage } from '@root/utilities/use-popup-window'

export default ({ searchParams }) => {
  useEffect(() => {
    const doHandleMessage = async () => {
      if (window.opener == null) window.close()

      const message: PopupMessage = {
        type: 'github',
        searchParams,
      }

      await window.opener.postMessage(message)
      window.close()
    }

    doHandleMessage()
  }, [searchParams])

  return null
}
