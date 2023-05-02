import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { PrivacyBanner } from '@components/PrivacyBanner'
import canUseDom from '@root/utilities/can-use-dom'
import { locate, LocateResponse } from '../../../functions-api'

type Privacy = {
  showConsent?: boolean
  cookieConsent?: boolean
  updateCookieConsent: (accepted: boolean) => void
  country?: string
}

const Context = createContext<Privacy>({
  showConsent: undefined,
  cookieConsent: undefined,
  updateCookieConsent: () => false,
  country: undefined,
})

type CookieConsent = {
  accepted: boolean
  at: string
  country: string
}

const getLocaleStorage = (): CookieConsent =>
  canUseDom && JSON.parse(window.localStorage.getItem('cookieConsent') || 'null')
const setLocaleStorage = (accepted: boolean, country: string) => {
  const cookieConsent: CookieConsent = {
    accepted,
    country,
    at: new Date().toISOString(),
  }
  window.localStorage.setItem('cookieConsent', JSON.stringify(cookieConsent))
}

const getGDPR = async (): Promise<LocateResponse> => {
  const res = await locate()
  if (res.status === 200) {
    const result: LocateResponse = await res.json()
    return result
  }
  return { isGDPR: true }
}

const usePrivacy = (): Privacy => useContext(Context)

type PrivacyProviderProps = {
  children: React.ReactNode
}

const PrivacyProvider: React.FC<PrivacyProviderProps> = props => {
  const { children } = props
  const [showConsent, setShowConsent] = useState<boolean | undefined>()
  const [cookieConsent, setCookieConsent] = useState<boolean | undefined>()
  const [country, setCountry] = useState<string | undefined>()

  const updateCookieConsent = useCallback(
    (accepted: boolean) => {
      setCookieConsent(accepted)
      setLocaleStorage(accepted, country || '')
    },
    [country],
  )

  useEffect(() => {
    ;(async () => {
      const consent = getLocaleStorage()
      if (consent !== null) {
        setCountry(consent?.country)
        setCookieConsent(consent.accepted)
        return
      }
      const gdpr = await getGDPR()
      if (gdpr.country) {
        setCountry(gdpr.country)
      }
      if (!gdpr.isGDPR) {
        setCookieConsent(true)
        updateCookieConsent(true)
      }
      setShowConsent(gdpr?.isGDPR || false)
    })()
  }, [updateCookieConsent])

  useEffect(() => {
    import('react-facebook-pixel')
      .then(x => x.default)
      .then(ReactPixel => {
        if (cookieConsent) {
          ReactPixel.grantConsent()
        } else {
          ReactPixel.revokeConsent()
        }
      })
  }, [cookieConsent])

  return (
    <Context.Provider
      value={{
        showConsent,
        cookieConsent,
        updateCookieConsent,
        country,
      }}
    >
      {children}
      {showConsent && <PrivacyBanner accept={() => updateCookieConsent(true)} />}
    </Context.Provider>
  )
}

export { PrivacyProvider, usePrivacy }
