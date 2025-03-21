'use client'

import type { PopupMessage } from '@root/utilities/use-popup-window'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

const Page = () => {
  // do not read `searchParams` prop, see https://github.com/vercel/next.js/issues/43077
  const searchParams = useSearchParams()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      if (window.opener == null) {
        window.close()
      }

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
