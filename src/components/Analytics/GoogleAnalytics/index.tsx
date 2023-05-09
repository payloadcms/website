'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

import { usePrivacy } from '@root/providers/Privacy'
import { analyticsEvent } from '@root/utilities/analytics'

const gaMeasurementID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const GoogleAnalytics: React.FC = () => {
  const pathname = usePathname()

  const { cookieConsent } = usePrivacy()

  React.useEffect(() => {
    if (!gaMeasurementID || !window?.location?.href) return

    analyticsEvent('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pathname,
    })
  }, [pathname])

  if (!cookieConsent || !gaMeasurementID) return null

  return (
    <React.Fragment>
      <Script defer src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementID}`} />
      <Script
        defer
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${gaMeasurementID}', { send_page_view: false });`,
        }}
      />
    </React.Fragment>
  )
}
