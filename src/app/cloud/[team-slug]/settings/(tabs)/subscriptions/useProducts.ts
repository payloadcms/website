import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'

// TODO: type this using the Stripe module
export interface Product {
  id: string
  default_payment_method: string
  name: string
}

export const useProducts = (args?: {
  delay?: number
}): {
  result: Product[] | null
  isLoading: 'loading' | 'updating' | 'deleting' | false | null
  error: string
  refreshProducts: () => void
} => {
  const { delay } = args || {}
  const isRequesting = useRef(false)
  const [result, setResult] = useState<Product[] | null>(null)
  const [isLoading, setIsLoading] = useState<'loading' | 'updating' | 'deleting' | false | null>(
    null,
  )
  const [error, setError] = useState('')

  const getProducts = useCallback(
    (successMessage?: string) => {
      let timer: NodeJS.Timeout

      if (isRequesting.current) return

      isRequesting.current = true

      const makeRetrieval = async (): Promise<void> => {
        try {
          setIsLoading('loading')

          const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/stripe/rest`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              stripeMethod: 'products.list',
              stripeArgs: [],
            }),
          })

          const json: {
            data: {
              data: Product[]
            }
          } = await req.json()

          if (req.ok) {
            setTimeout(() => {
              setResult(json?.data?.data)
              setError('')
              setIsLoading(false)
              if (successMessage) {
                toast.success(successMessage)
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
        }

        isRequesting.current = false
      }

      makeRetrieval()

      // eslint-disable-next-line consistent-return
      return () => {
        clearTimeout(timer)
      }
    },
    [delay],
  )

  useEffect(() => {
    getProducts()
  }, [getProducts])

  const refreshProducts = useCallback(
    (successMessage?: string) => {
      getProducts(successMessage)
    },
    [getProducts],
  )

  const memoizedState = useMemo(
    () => ({
      result,
      isLoading,
      error,
      refreshProducts,
    }),
    [result, isLoading, error, refreshProducts],
  )

  return memoizedState
}
