import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useConfirmCardSetup } from '@root/app/new/(checkout)/useConfirmCardSetup'
import type { Team } from '@root/payload-cloud-types'

export const useSaveNewPaymentMethod = (args: {
  team: Team
  onSave: () => void
  newCardID: string
}): {
  success?: string
  isLoading: boolean | null
  error?: string
  saveNewPaymentMethod: (paymentMethod: string) => void
} => {
  const { team, onSave, newCardID } = args
  const isRequesting = useRef(false)
  const [success, setSuccess] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const [error, setError] = useState<string | undefined>()

  const confirmCardSetup = useConfirmCardSetup({
    team,
  })

  const saveNewPaymentMethod = useCallback(async () => {
    if (isRequesting.current) {
      return
    }

    isRequesting.current = true
    setSuccess(undefined)
    setError(undefined)
    setIsLoading(true)

    try {
      await confirmCardSetup(newCardID)

      if (typeof onSave === 'function') {
        await onSave()
      }

      setIsLoading(false)
      setSuccess('New card saved')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
      setIsLoading(false)
    }

    isRequesting.current = false
  }, [confirmCardSetup, onSave, newCardID])

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
    () => ({ success, isLoading, error, saveNewPaymentMethod }),
    [success, isLoading, error, saveNewPaymentMethod],
  )

  return memoizedState
}
