'use client'

import { ModalProvider } from '@faceless-ui/modal'
import { BulkUploadProvider } from '@payloadcms/ui/elements/BulkUpload'
import { AuthProvider } from '@payloadcms/ui/providers/Auth'
import { ConfigProvider } from '@payloadcms/ui/providers/Config'
import { LocaleProvider } from '@payloadcms/ui/providers/Locale'
import { TranslationProvider } from '@payloadcms/ui/providers/Translation'
import { en } from 'payload/i18n/en'

const previewConfig = {
  admin: {
    routes: {
      inactivity: '/logout-inactivity',
    },
    user: 'users',
  },
  collections: [
    {
      slug: 'posts',
      admin: { useAsTitle: 'title' },
      fields: [],
      labels: { plural: 'Posts', singular: 'Post' },
    },
    {
      slug: 'media',
      admin: { useAsTitle: 'filename' },
      fields: [],
      labels: { plural: 'Media', singular: 'Media' },
      upload: {},
    },
  ],
  globals: [],
  routes: {
    admin: '/admin',
    api: '/api',
  },
  serverURL: '',
}

const previewPermissions = {
  collections: {
    media: { create: true, read: true },
    posts: { create: true, read: true },
  },
  globals: {},
}

export const FieldPreviewProviders = ({ children }: { children: React.ReactNode }) => (
  <TranslationProvider
    dateFNSKey="en-US"
    fallbackLang="en"
    language="en"
    languageOptions={[{ label: 'English', value: 'en' }]}
    switchLanguageServerAction={() => Promise.resolve()}
    translations={en.translations}
  >
    {children}
  </TranslationProvider>
)

export const RelationshipPreviewProviders = ({
  apiRoute = previewConfig.routes.api,
  children,
}: {
  apiRoute?: string
  children: React.ReactNode
}) => (
  <ConfigProvider
    config={
      {
        ...previewConfig,
        routes: {
          ...previewConfig.routes,
          api: apiRoute,
        },
      } as never
    }
  >
    <FieldPreviewProviders>
      <AuthProvider
        permissions={previewPermissions as never}
        user={{ id: 'preview-user', collection: 'users' } as never}
      >
        <LocaleProvider>
          <ModalProvider classPrefix="component-preview-field" transTime={0} zIndex={1}>
            <BulkUploadProvider drawerSlugPrefix="component-preview">{children}</BulkUploadProvider>
          </ModalProvider>
        </LocaleProvider>
      </AuthProvider>
    </FieldPreviewProviders>
  </ConfigProvider>
)
