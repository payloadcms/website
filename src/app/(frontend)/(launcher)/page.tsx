import type { Metadata } from 'next'

import { Gutter } from '@components/Gutter/index'
import { Heading } from '@components/Heading/index'
import Link from 'next/link'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import React from 'react'

export const dynamic = 'force-dynamic'

export default async function LauncherPage() {
  return (
    <Gutter>
      <div style={{ padding: 'calc(var(--base) * 4) 0', textAlign: 'center' }}>
        <Heading as="h1" element="h1" marginTop={false}>
          창업ON케어
        </Heading>
        <p style={{ fontSize: '1.25rem', marginBottom: 'calc(var(--base) * 3)', color: 'var(--theme-elevation-600)' }}>
          질문에 답하면 웹사이트가 만들어집니다
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'calc(var(--base) * 2)',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <Link
            href="/launcher/onboarding"
            style={{
              padding: 'calc(var(--base) * 3)',
              background: 'var(--color-success)',
              color: 'white',
              borderRadius: 'calc(var(--base))',
              textDecoration: 'none',
              transition: 'transform 0.2s ease',
            }}
          >
            <h3 style={{ marginBottom: 'calc(var(--base))' }}>새 사이트 만들기</h3>
            <p style={{ opacity: 0.9 }}>
              5분 만에 웹사이트, 블로그, 모바일 앱까지
            </p>
          </Link>

          <Link
            href="/launcher/templates"
            style={{
              padding: 'calc(var(--base) * 3)',
              background: 'var(--theme-elevation-100)',
              borderRadius: 'calc(var(--base))',
              textDecoration: 'none',
              border: '1px solid var(--theme-elevation-200)',
            }}
          >
            <h3 style={{ marginBottom: 'calc(var(--base))' }}>템플릿 둘러보기</h3>
            <p style={{ color: 'var(--theme-elevation-600)' }}>
              업종별 맞춤 템플릿 미리보기
            </p>
          </Link>

          <Link
            href="/launcher/dashboard"
            style={{
              padding: 'calc(var(--base) * 3)',
              background: 'var(--theme-elevation-100)',
              borderRadius: 'calc(var(--base))',
              textDecoration: 'none',
              border: '1px solid var(--theme-elevation-200)',
            }}
          >
            <h3 style={{ marginBottom: 'calc(var(--base))' }}>내 사이트 관리</h3>
            <p style={{ color: 'var(--theme-elevation-600)' }}>
              생성한 사이트 수정 및 분석
            </p>
          </Link>
        </div>

        <div style={{ marginTop: 'calc(var(--base) * 4)' }}>
          <h4 style={{ marginBottom: 'calc(var(--base))' }}>CareOn 연동 시 무료</h4>
          <p style={{ color: 'var(--theme-elevation-600)' }}>
            CCTV, POS 구독 고객은 모든 기능을 무료로 사용할 수 있습니다
          </p>
        </div>
      </div>
    </Gutter>
  )
}

export const metadata: Metadata = {
  openGraph: mergeOpenGraph({
    title: '창업ON케어 | 신자동 런처',
    url: '/launcher',
  }),
  title: '창업ON케어 | 신자동 런처',
}
