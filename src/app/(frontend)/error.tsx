'use client'
import { Gutter } from '@components/Gutter/index'
import NextError from 'next/error'
import React from 'react'

export default function Error() {
  return (
    <Gutter>
      <h2>Something went wrong</h2>
      <NextError statusCode={0} />
    </Gutter>
  )
}
