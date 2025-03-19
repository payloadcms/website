'use client'

import { usePrivacy } from '@root/providers/Privacy/index'
import { analyticsEvent } from '@root/utilities/analytics'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import * as React from 'react'

const gaMeasurementID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const GoogleAnalytics: React.FC = () => {
  const pathname = usePathname()

  const { cookieConsent } = usePrivacy()

  React.useEffect(() => {
    if (!gaMeasurementID || !window?.location?.href) {
      return
    }

    analyticsEvent('page_view', {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    })
  }, [pathname])

  if (!cookieConsent || !gaMeasurementID) {
    return null
  }

  return (
    <React.Fragment>
      <Script defer src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementID}`} />
      <Script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${gaMeasurementID}', { send_page_view: false });`,
        }}
        defer
        id="google-analytics"
      />
    </React.Fragment>
  )
}
