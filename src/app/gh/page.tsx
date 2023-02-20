'use client'

import { useEffect } from 'react'

export default ({
  searchParams: {
    state, // the redirect URL, 'state' is the catch-all query param by the GitHub App API
    code,
  },
}) => {
  useEffect(() => {
    if (window.opener == null) window.close()
    window.opener.postMessage(code)
    window.close()
  }, [code, state])

  return null
}
