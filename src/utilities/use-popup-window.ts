import type { ReadonlyURLSearchParams } from 'next/navigation'

import { useCallback, useEffect, useRef } from 'react'

export interface PopupMessage {
  searchParams: {
    [key: string]: ReadonlyURLSearchParams | string | undefined
    code: string
    installation_id: string
    state: string
  }
  type: string
}

export const usePopupWindow = (props: {
  eventType?: string
  href: string

  onMessage?: (searchParams: PopupMessage['searchParams']) => Promise<void>
}): {
  openPopupWindow: (e: React.MouseEvent<HTMLAnchorElement>) => void
} => {
  const { eventType, href, onMessage } = props
  const isReceivingMessage = useRef(false)

  // NOTE: GitHub allows multiple redirect URIs to be set in the App Settings, one for each environment using this App
  // But there is a known issue when working locally where GitHub will redirect back to the first valid redirect URI in the list
  // This is likely because the local domain is insecure (http://local.payloadcms.com), and so it's falling back (https://payloadcms.com)
  // This means that locally installing the GitHub app will not properly redirect you, the page will simply remain as-is
  // Instead of expecting a redirect, you'll just need to refresh the page after installing the app
  useEffect(() => {
    const receiveMessage = async (event: MessageEvent): Promise<void> => {
      if (event.origin !== window.location.origin) {
        console.warn(`Message received by ${event.origin}; IGNORED.`) // eslint-disable-line no-console
        return
      }

      if (
        typeof onMessage === 'function' &&
        event.data?.type === eventType &&
        !isReceivingMessage.current
      ) {
        isReceivingMessage.current = true
        await onMessage(event.data?.searchParams)
        isReceivingMessage.current = false
      }
    }

    window.addEventListener('message', receiveMessage, false)

    return () => {
      window.removeEventListener('message', receiveMessage)
    }
  }, [onMessage, eventType])

  const openPopupWindow = useCallback(
    (e) => {
      e.preventDefault()

      const features = {
        height: 700,
        left: 'auto',
        menubar: 'no',
        popup: 'yes',
        toolbar: 'no',
        top: 'auto',
        width: 800,
      }

      const popupOptions = Object.entries(features)
        .reduce((str, [key, value]) => {
          let strCopy = str
          if (value === 'auto') {
            if (key === 'top') {
              const v = Math.round(window.innerHeight / 2 - features.height / 2)
              strCopy += `top=${v},`
            } else if (key === 'left') {
              const v = Math.round(window.innerWidth / 2 - features.width / 2)
              strCopy += `left=${v},`
            }
            return strCopy
          }

          strCopy += `${key}=${value},`
          return strCopy
        }, '')
        .slice(0, -1) // remove last ',' (comma)

      window.open(href, '_blank', popupOptions)
    },
    [href],
  )

  return {
    openPopupWindow,
  }
}
