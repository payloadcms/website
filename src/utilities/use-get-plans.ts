import { useEffect, useMemo, useRef, useState } from 'react'

import type { Plan } from '@root/payload-cloud-types'

export type UseGetPlans = () => {
  plans: Plan[]
  isLoading: boolean
  error: string
}

export const useGetPlans: UseGetPlans = () => {
  const hasMadeRequest = useRef(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (hasMadeRequest.current) return
    hasMadeRequest.current = true

    const fetchPlans = async (): Promise<void> => {
      try {
        setIsLoading(true)

        const plansReq = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/plans?where[slug][not_equals]=enterprise&sort=order`,
          {
            credentials: 'include',
          },
        )

        const json = await plansReq.json()

        if (plansReq.ok) {
          setPlans(json.docs)
          setIsLoading(false)
        } else {
          throw new Error(json.message)
        }
      } catch (err: unknown) {
        const message = (err as Error)?.message || 'Something went wrong'
        setError(message)
        setIsLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const memoizedState = useMemo(() => ({ plans, isLoading, error }), [plans, isLoading, error])

  return memoizedState
}
