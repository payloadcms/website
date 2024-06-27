'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { PopupMessage } from '@root/utilities/use-popup-window.js'

const Page = () => {
  // do not read `searchParams` prop, see https://github.com/vercel/next.js/issues/43077
  const searchParams = useSearchParams()

  useEffect(() => {
    ;(async () => {
      if (window.opener == null) window.close()

      const paramObj = Object.fromEntries(
        searchParams?.entries() || [],
      ) as PopupMessage['searchParams']

      const message: PopupMessage = {
        type: 'github',
        searchParams: paramObj,
      }

      await window.opener.postMessage(message)
      window.close()
    })()
  }, [searchParams])

  return null
}

export default () => {
  return (
    <Suspense>
      <Page />
    </Suspense>
  )
}
