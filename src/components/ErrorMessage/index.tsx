'use client'

import { CallToAction } from '@blocks/CallToAction/index'
import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar/index'
import { DefaultHero } from '@components/Hero/Default/index'
import React from 'react'

export const ErrorMessage: React.FC<{ error?: string }> = ({ error }) => {
  return (
    <React.Fragment>
      <BreadcrumbsBar breadcrumbs={undefined} links={undefined} />
      <CallToAction
        blockType="cta"
        ctaFields={{
          links: [
            {
              link: {
                type: 'custom',
                label: 'Back To Homepage',
                reference: undefined,
                url: '/',
              },
            },
          ],
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: error || '404',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  tag: 'h1',
                  version: 1,
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'Sorry, the page you requested cannot be found.',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  textFormat: 0,
                  textStyle: '',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
        }}
        padding={{ bottom: 'large', top: 'large' }}
      />
    </React.Fragment>
  )
}
