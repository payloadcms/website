import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PaymentMethod } from '@stripe/stripe-js'

export const useDeletePaymentMethod = (args: {
  onDelete?: () => void
  delay?: number
}): {
  success: string
  isLoading: boolean | null
  error: string
  deletePaymentMethod: (paymentMethod: string) => void
} => {
  const { onDelete, delay } = args
  const isRequesting = useRef(false)
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const [error, setError] = useState('')

  const deletePaymentMethod = useCallback(
    (paymentMethod: string) => {
      let timer: NodeJS.Timeout

      if (!paymentMethod) {
        setError('No payment method')
        return
      }

      if (isRequesting.current) return

      isRequesting.current = true

      const makeRequest = async (): Promise<void> => {
        try {
          setIsLoading(true)

          const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/stripe/rest`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              stripeMethod: 'paymentMethods.detach',
              stripeArgs: [paymentMethod],
            }),
          })

          const json: {
            data: {
              data: PaymentMethod[]
            }
          } = await req.json()

          if (req.ok) {
            setTimeout(async () => {
              setSuccess('Payment method deleted')
              setError('')
              setIsLoading(false)

              if (typeof onDelete === 'function') {
                onDelete()
              }
            }, delay)
          } else {
            // @ts-expect-error
            throw new Error(json?.message)
          }
        } catch (err: unknown) {
          const message = (err as Error)?.message || 'Something went wrong'
          setError(message)
          setIsLoading(false)
          setSuccess('')
        }

        isRequesting.current = false
      }

      makeRequest()

      // eslint-disable-next-line consistent-return
      return () => {
        clearTimeout(timer)
      }
    },
    [onDelete, delay],
  )

  // auto clear success message after x seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('')
      }, 3000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [success])

  const memoizedState = useMemo(
    () => ({ success, isLoading, error, deletePaymentMethod }),
    [success, isLoading, error, deletePaymentMethod],
  )

  return memoizedState
}
