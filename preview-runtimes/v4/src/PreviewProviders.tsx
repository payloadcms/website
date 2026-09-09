'use client'

import type { LinkAdapterProps, RouterAdapterRouter, ServerFunctionClient } from 'payload'

import { en } from '@payloadcms/translations/languages/en'
import { RouterAdapterContext } from '@payloadcms/ui/providers/RouterAdapter'
import { ServerFunctionsProvider } from '@payloadcms/ui/providers/ServerFunctions'
import { TranslationProvider } from '@payloadcms/ui/providers/Translation'
import React from 'react'

const PreviewLink: React.FC<LinkAdapterProps> = ({ children, href, ref, ...props }) => (
  <a href={href} ref={ref} {...props}>
    {children}
  </a>
)

const previewRouter: RouterAdapterRouter = {
  back: () => undefined,
  push: () => undefined,
  refresh: () => undefined,
  replace: () => undefined,
  replaceState: () => undefined,
}

const previewServerFunction: ServerFunctionClient = () => undefined

export const PreviewProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RouterAdapterContext
    value={{
      Link: PreviewLink,
      params: {},
      pathname: '',
      router: previewRouter,
      searchParams: new URLSearchParams(),
    }}
  >
    <ServerFunctionsProvider serverFunction={previewServerFunction}>
      <TranslationProvider
        dateFNSKey={en.dateFNSKey}
        fallbackLang="en"
        language="en"
        languageOptions={[{ label: 'English', value: 'en' }]}
        translations={en.translations}
      >
        {children}
      </TranslationProvider>
    </ServerFunctionsProvider>
  </RouterAdapterContext>
)
