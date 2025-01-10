import React from 'react'

type WebSocketHookArgs = {
  onClose?: () => void
  onError?: (error: Event) => void
  onMessage: (message: MessageEvent) => void
  onOpen?: () => void
  retryOnClose?: boolean
  url: string
}

export const useWebSocket = ({
  onClose,
  onError,
  onMessage,
  onOpen,
  retryOnClose,
  url,
}: WebSocketHookArgs): void => {
  const socketRef = React.useRef<null | WebSocket>(null)

  const setupWebSocket = React.useCallback(
    (newURL) => {
      if (!newURL) {
        return null
      }

      const webSocket = new WebSocket(newURL)

      webSocket.onopen = () => {
        if (onOpen) {
          onOpen()
        }
      }

      webSocket.onmessage = (event) => {
        onMessage(event)
      }

      webSocket.onerror = (error) => {
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
