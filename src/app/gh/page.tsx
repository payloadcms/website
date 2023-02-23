'use client'

import { useEffect } from 'react'

import { PopupMessage } from '@root/utilities/use-popup-window'

export default ({ searchParams }) => {
  useEffect(() => {
    if (window.opener == null) window.close()
    const message: PopupMessage = {
      type: 'github-oauth',
      searchParams,
    }

    window.opener.postMessage(message)
    window.close()
  }, [searchParams])

  return null
}
