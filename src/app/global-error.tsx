'use client'

import NextError from 'next/error'
import React from 'react'

export default function GlobalError() {
  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
