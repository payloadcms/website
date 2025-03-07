'use client'

import { usePrivacy } from '@root/providers/Privacy/index'
import Script from 'next/script'
import React, { Fragment } from 'react'

const gtmMeasurementID = process.env.NEXT_PUBLIC_GTM_MEASUREMENT_ID

export const GoogleTagManager: React.FC = () => {
  const { cookieConsent } = usePrivacy()

  if (!cookieConsent || !gtmMeasurementID) {
    return null
  }

  return (
    <Fragment>
      <Script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmMeasurementID}');`,
        }}
        defer
        id="google-tag-manager"
      />

      <noscript>
        <iframe
          height="0"
          src={`https://www.googletagmanager.com/ns.html?id=${gtmMeasurementID}`}
          style={{
            display: 'none',
            visibility: 'hidden',
          }}
          width="0"
        ></iframe>
      </noscript>
    </Fragment>
  )
}
