import React from 'react'

type WebSocketHookArgs = {
  url: string
  onMessage: (message: MessageEvent) => void
  onError?: (error: Event) => void
  onOpen?: () => void
  onClose?: () => void
  retryOnClose?: boolean
}

export const useWebSocket = ({
  url,
  onOpen,
  onMessage,
  onError,
  onClose,
  retryOnClose,
}: WebSocketHookArgs): void => {
  const socketRef = React.useRef<WebSocket | null>(null)

  const setupWebSocket = React.useCallback(
    newURL => {
      if (!newURL) return null

      const webSocket = new WebSocket(newURL)

      webSocket.onopen = () => {
        if (onOpen) {
          onOpen()
        }
      }

      webSocket.onmessage = event => {
        onMessage(event)
      }

      webSocket.onerror = error => {
        if (onError) {
          onError(error)
        }
      }

      webSocket.onclose = () => {
        if (onClose) {
          onClose()
        }

        if (retryOnClose && socketRef?.current) {
          socketRef.current.close()
          setupWebSocket(newURL)
        }
      }

      socketRef.current = webSocket
    },
    [onOpen, onMessage, onError, onClose, retryOnClose],
  )

  React.useEffect(() => {
    const socket = socketRef.current
    if (url && socket && socket?.url !== url) {
      socket.close()
      setupWebSocket(url)
    } else if (url && !socket) {
      setupWebSocket(url)
    }
  }, [url, setupWebSocket])
}
