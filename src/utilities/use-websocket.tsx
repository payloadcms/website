import { useEffect, useRef, useState } from 'react'

type WebSocketHookReturnType = [string, (message: string) => void, Event | null]

export function useWebSocket(url: string, onOpen?: () => void): WebSocketHookReturnType {
  const [message, setMessage] = useState('')
  const [error, setError] = useState<Event | null>(null)
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!url) return

    const wsURL = url.replace(/^http/, 'ws')

    try {
      socketRef.current = new WebSocket(wsURL)

      socketRef.current.onopen = () => {
        if (onOpen) {
          onOpen()
        }
      }

      socketRef.current.onmessage = event => {
        setMessage(event.data)
      }

      socketRef.current.onerror = error => {
        setError(error)
      }

      return () => {
        if (socketRef.current) {
          socketRef.current.close()
        }
      }
    } catch (e: unknown) {
      console.error(`Error connecting to websocket url ${wsURL}`, e)
    }
  }, [url, onOpen])

  const sendMessage = (message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message)
    }
  }

  return [message, sendMessage, error]
}
