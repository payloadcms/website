import { redirect } from 'next/navigation'

import { useCheckToken } from '@root/utilities/use-check-token'
import useDebounce from '@root/utilities/use-debounce'

export const useGitAuthRedirect = (args?: {
  pageTitle: string
}): {
  tokenLoading: boolean
  tokenIsValid: boolean
} => {
  const { pageTitle } = args || { pageTitle: '' }
  const { tokenIsValid, loading: tokenLoading, error: tokenError } = useCheckToken()

  const loading = useDebounce(tokenLoading, 1000)

  if (!loading && (tokenError || !tokenIsValid)) {
    redirect(
      `/new/authorize?redirect=${encodeURIComponent(window.location.pathname)}${pageTitle ? `&title=${encodeURIComponent(pageTitle)}&scope=repo` : ''
      }`,
    )
  }

  return {
    tokenLoading: loading,
    tokenIsValid,
  }
}
