'use client'

import canUseDom from '@root/utilities/can-use-dom'
import React, { createContext, use, useCallback, useEffect, useState } from 'react'

type Privacy = {
  cookieConsent?: boolean
  country?: string
  showConsent?: boolean
  updateCookieConsent: (accepted: boolean) => void
}

const Context = createContext<Privacy>({
  cookieConsent: undefined,
  country: undefined,
  showConsent: undefined,
  updateCookieConsent: () => false,
})

type CookieConsent = {
  accepted: boolean
  at: string
  country: string
}

const getLocaleStorage = (): CookieConsent | null =>
  canUseDom ? JSON.parse(window.localStorage.getItem('cookieConsent') || 'null') : null

const setLocaleStorage = (accepted: boolean, country: string) => {
  const cookieConsent: CookieConsent = {
    accepted,
    at: new Date().toISOString(),
    country,
  }
  window.localStorage.setItem('cookieConsent', JSON.stringify(cookieConsent))
}

const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      if (consent) {
        setCountry(consent.country)
        setCookieConsent(consent.accepted || false)
        return
      }
      const gdpr = await fetch('/api/locate').then((res) => res.json())

      setCountry(gdpr.country || '')
      if (!gdpr.isGDPR) {
        setCookieConsent(true)
        updateCookieConsent(true)
      }
      setShowConsent(gdpr.isGDPR || false)
    })().catch(console.error)
  }, [updateCookieConsent])

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        if (cookieConsent) {
          ReactPixel.grantConsent()
        } else {
          ReactPixel.revokeConsent()
        }
      })
      .catch(console.error)
  }, [cookieConsent])

  return (
    <Context value={{ cookieConsent, country, showConsent, updateCookieConsent }}>
      {children}
    </Context>
  )
}

const usePrivacy = (): Privacy => use(Context)

export { PrivacyProvider, usePrivacy }
