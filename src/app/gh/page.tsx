'use client'

import { useEffect } from 'react'

import { PopupMessage } from '@root/utilities/use-popup'

export default ({
  searchParams: {
    state, // the redirect URL, 'state' is the catch-all query param by the GitHub App API
    code,
  },
}) => {
  useEffect(() => {
    if (window.opener == null) window.close()
    const message: PopupMessage = {
      type: 'github-oauth',
      payload: { code, state },
    }

    window.opener.postMessage(message)
    window.close()
  }, [code, state])

  return null
}
