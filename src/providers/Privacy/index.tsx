'use client'

import canUseDom from '@root/utilities/can-use-dom.js'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { LocateResponse } from '../../../functions-api.js';

import { locate } from '../../../functions-api.js'

type Privacy = {
  cookieConsent?: boolean
  country?: string
  showConsent?: boolean
  updateCookieConsent: (accepted: boolean, rejected: boolean) => void
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
  rejected: boolean
}

const getLocaleStorage = (): CookieConsent =>
  canUseDom && JSON.parse(window.localStorage.getItem('cookieConsent') || 'null')
const setLocaleStorage = (accepted: boolean, rejected: boolean, country: string) => {
  const cookieConsent: CookieConsent = {
    accepted,
    at: new Date().toISOString(),
    country,
    rejected,
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

type PrivacyProviderProps = {
  children: React.ReactNode
}

const PrivacyProvider: React.FC<PrivacyProviderProps> = props => {
  const { children } = props
  const [showConsent, setShowConsent] = useState<boolean | undefined>()
  const [cookieConsent, setCookieConsent] = useState<boolean | undefined>()
  const [country, setCountry] = useState<string | undefined>()

  const updateCookieConsent = useCallback(
    (accepted: boolean, rejected: boolean) => {
      setCookieConsent(accepted)
      setLocaleStorage(accepted, rejected, country || '')
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
        updateCookieConsent(true, false)
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
        cookieConsent,
        country,
        showConsent,
        updateCookieConsent,
      }}
    >
      {children}
    </Context.Provider>
  )
}

const usePrivacy = (): Privacy => useContext(Context)

export { PrivacyProvider, usePrivacy }
