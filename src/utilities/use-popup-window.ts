import { useCallback, useEffect } from 'react'

export interface PopupMessage {
  type: string
  searchParams: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const usePopupWindow = (props: {
  href: string
  eventType?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMessage?: (searchParams: any) => Promise<void> // eslint-disable-line no-unused-vars
}): {
  openPopupWindow: (e: React.MouseEvent<HTMLAnchorElement>) => void
} => {
  const { href, onMessage, eventType } = props

  useEffect(() => {
    const receiveMessage = async (event: MessageEvent): Promise<void> => {
      if (event.origin !== window.location.origin) {
        console.warn(`Message received by ${event.origin}; IGNORED.`) // eslint-disable-line no-console
        return
      }

      if (typeof onMessage === 'function' && event.data?.type === eventType) {
        await onMessage(event.data?.searchParams)
      }
    }

    window.addEventListener('message', receiveMessage, false)

    return () => {
      window.removeEventListener('message', receiveMessage)
    }
  }, [onMessage, eventType])

  const openPopupWindow = useCallback(
    e => {
      e.preventDefault()

      const features = {
        popup: 'yes',
        width: 800,
        height: 700,
        top: 'auto',
        left: 'auto',
        toolbar: 'no',
        menubar: 'no',
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
