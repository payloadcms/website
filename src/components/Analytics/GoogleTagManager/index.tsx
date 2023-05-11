'use client'

import React, { Fragment } from 'react'
import Script from 'next/script'

import { usePrivacy } from '@root/providers/Privacy'

const gtmMeasurementID = process.env.NEXT_PUBLIC_GTM_MEASUREMENT_ID

export const GoogleTagManager: React.FC = () => {
  const { cookieConsent } = usePrivacy()

  if (!cookieConsent || !gtmMeasurementID) return null

  return (
    <Fragment>
      <Script
        id="google-tag-manager"
        defer
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmMeasurementID}');`,
        }}
      />

      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmMeasurementID}`}
          height="0"
          width="0"
          style={{
            display: 'none',
            visibility: 'hidden',
          }}
        ></iframe>
      </noscript>
    </Fragment>
  )
}
