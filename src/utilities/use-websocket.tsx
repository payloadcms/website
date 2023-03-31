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
  const [socket, setSocket] = React.useState<WebSocket | null>(() => {
    if (!url) return null

    const webSocket = new WebSocket(url)

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
    }

    return webSocket
  })

  React.useEffect(() => {
    if (url && socket && socket?.url !== url) {
      socket.close()
      setSocket(new WebSocket(url))
    } else if (url && !socket) {
      setSocket(new WebSocket(url))
    }
  }, [url, socket])
}
