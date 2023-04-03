import React from 'react'

type WebSocketHookArgs = {
  url: string
  onMessage: (message: MessageEvent) => void
  onError?: (error: Event) => void
  onOpen?: () => void
  onClose?: () => void
}

export const useWebSocket = ({
  url,
  onOpen,
  onMessage,
  onError,
  onClose,
}: WebSocketHookArgs): void => {
  const socketRef = React.useRef<WebSocket | null>()

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
        console.log('error', error)
        if (onError) {
          onError(error)
        }
      }

      webSocket.onclose = () => {
        if (onClose) {
          onClose()
        }
      }

      socketRef.current = webSocket
    },
    [onOpen, onMessage, onError, onClose],
  )

  React.useEffect(() => {
    const socket = socketRef.current
    if (url && socket && socket?.url !== url) {
      console.log('closing socket')
      socket.close()
      setupWebSocket(url)
    } else if (url && !socket) {
      console.log('setting up socket')
      setupWebSocket(url)
    }
  }, [url, setupWebSocket])
}
