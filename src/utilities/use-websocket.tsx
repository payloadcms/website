import { useState } from 'react'

type WebSocketHookReturnType = [string, Event | null]

export function useWebSocket(url: string, onOpen?: () => void): WebSocketHookReturnType {
  const [message, setMessage] = useState('')
  const [error, setError] = useState<Event | null>(null)
  const [socket] = useState<WebSocket>(() => {
    const webSocket = new WebSocket(url)

    webSocket.onopen = () => {
      console.log('opened') // eslint-disable-line no-console
      if (onOpen) {
        onOpen()
      }
    }

    webSocket.onmessage = event => {
      console.log(event.data) // eslint-disable-line no-console
      setMessage(event.data)
    }

    webSocket.onerror = error => {
      setError(error)
    }

    webSocket.onclose = () => {
      console.log('closed') // eslint-disable-line no-console
    }

    return webSocket
  })

  return [message, error]
}
