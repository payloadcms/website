'use client'

import React from 'react'

import { CallToAction } from '@blocks/CallToAction'
import { DefaultHero } from '@components/Hero/Default'

export const ErrorMessage: React.FC<{ error?: string }> = ({ error }) => {
  return (
    <>
      <DefaultHero />
      <CallToAction
        blockType="cta"
        ctaFields={{
          richText: [
            {
              children: [
                {
                  text: `${error || '404'}`,
                  underline: true,
                  forceDark: true,
                },
              ],
              type: 'h1',
            },
            {
              children: [
                {
                  text: 'Sorry, the page you requested cannot be found.',
                },
              ],
            },
          ],
          feature: 'none',
          links: [
            {
              link: {
                // @ts-expect-error
                reference: undefined,
                type: 'custom',
                url: '/',
                label: 'Back To Homepage',
              },
            },
          ],
        }}
      />
    </>
  )
}
