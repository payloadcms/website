'use client'
import { en } from '@payloadcms/translations/languages/en'
import { FileDetails } from '@payloadcms/ui/elements/FileDetails'
import { PreviewSizes } from '@payloadcms/ui/elements/PreviewSizes'
import { TranslationProvider } from '@payloadcms/ui/providers/Translation'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'
const image =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"%3E%3Crect width="640" height="400" fill="%23ded8ff"/%3E%3Ccircle cx="150" cy="125" r="55" fill="%236d5dfc"/%3E%3Cpath d="M0 400 215 205l105 90 95-75 225 180Z" fill="%238b7cf6"/%3E%3C/svg%3E'
const thumbnail =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"%3E%3Crect width="320" height="200" fill="%23ded8ff"/%3E%3Ccircle cx="75" cy="63" r="28" fill="%236d5dfc"/%3E%3Cpath d="M0 200 108 103l52 45 48-38 112 90Z" fill="%238b7cf6"/%3E%3C/svg%3E'
// The preview runtime is pinned to a v4 canary that still reads the legacy names.
const uploadConfig = {
  displayPreview: true,
  imageSizes: [{ name: 'thumbnail' }],
  variants: [{ name: 'thumbnail' }],
}
const thumbnailVariant = {
  filename: 'landscape-320x200.jpg',
  filesize: 62464,
  height: 200,
  mimeType: 'image/jpeg',
  url: thumbnail,
  width: 320,
}
const doc = {
  alt: 'Abstract landscape',
  filename: 'landscape.jpg',
  filesize: 184320,
  height: 400,
  mimeType: 'image/jpeg',
  sizes: {
    thumbnail: thumbnailVariant,
  },
  thumbnailURL: thumbnail,
  url: image,
  variants: {
    thumbnail: thumbnailVariant,
  },
  width: 640,
}
const PreviewTranslationProvider = ({ children }: { children: React.ReactNode }) => (
  <TranslationProvider
    dateFNSKey="en-US"
    fallbackLang="en"
    language="en"
    languageOptions={[{ label: 'English', value: 'en' }]}
    translations={en.translations}
  >
    {children}
  </TranslationProvider>
)
export const uploadHelpersExamples: ComponentRenders = {
  fileDetails: {
    render: () => (
      <PreviewTranslationProvider>
        <div className={classes.uploadDetailsDemo}>
          <FileDetails
            collectionSlug="media"
            doc={doc as never}
            hideRemoveFile
            uploadConfig={uploadConfig as never}
          />
        </div>
      </PreviewTranslationProvider>
    ),
  },
  previewSizes: {
    render: () => (
      <div className={classes.previewSizesDemo}>
        <PreviewSizes doc={doc as never} uploadConfig={uploadConfig as never} />
      </div>
    ),
  },
}
