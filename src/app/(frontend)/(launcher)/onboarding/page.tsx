import type { Metadata } from 'next'

import { Gutter } from '@components/Gutter/index'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import React, { Fragment } from 'react'

import { OnboardingWizard } from './page_client'

export const dynamic = 'force-dynamic'

export default async function OnboardingPage() {
  return (
    <Fragment>
      <OnboardingWizard />
    </Fragment>
  )
}

export const metadata: Metadata = {
  openGraph: mergeOpenGraph({
    title: '사이트 생성하기 | 창업ON케어',
    url: '/launcher/onboarding',
  }),
  title: '사이트 생성하기 | 창업ON케어',
}
