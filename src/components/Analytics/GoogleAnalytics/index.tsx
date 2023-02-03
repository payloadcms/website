'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

import { analyticsEvent } from '@root/utilities/analytics'

const gaMeasurementID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const GoogleAnalytics: React.FC = () => {
  const pathname = usePathname()

  React.useEffect(() => {
    if (window?.location?.href) {
      analyticsEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: pathname,
      })
    }
  }, [pathname])

  return (
    <React.Fragment>
      <Script defer src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementID}`} />
      <Script
        defer
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
