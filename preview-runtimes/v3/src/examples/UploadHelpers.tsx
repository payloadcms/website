'use client'

import { FileDetails } from '@payloadcms/ui/elements/FileDetails'
import { PreviewSizes } from '@payloadcms/ui/elements/PreviewSizes'
import { TranslationProvider } from '@payloadcms/ui/providers/Translation'
import { en } from 'payload/i18n/en'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

const image =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"%3E%3Crect width="640" height="400" fill="%23ded8ff"/%3E%3Ccircle cx="150" cy="125" r="55" fill="%236d5dfc"/%3E%3Cpath d="M0 400 215 205l105 90 95-75 225 180Z" fill="%238b7cf6"/%3E%3C/svg%3E'

const thumbnail =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"%3E%3Crect width="320" height="200" fill="%23ded8ff"/%3E%3Ccircle cx="75" cy="63" r="28" fill="%236d5dfc"/%3E%3Cpath d="M0 200 108 103l52 45 48-38 112 90Z" fill="%238b7cf6"/%3E%3C/svg%3E'

const uploadConfig = {
  displayPreview: true,
  imageSizes: [{ name: 'thumbnail' }],
}

const doc = {
  alt: 'Abstract landscape',
  filename: 'landscape.jpg',
  filesize: 184320,
  height: 400,
  mimeType: 'image/jpeg',
  sizes: {
    thumbnail: {
      filename: 'landscape-320x200.jpg',
      filesize: 62464,
      height: 200,
      mimeType: 'image/jpeg',
      url: thumbnail,
      width: 320,
    },
  },
  thumbnailURL: thumbnail,
  url: image,
  width: 640,
}

const PreviewTranslationProvider = ({ children }: { children: React.ReactNode }) => (
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

export const uploadHelpersExamples: ComponentExamples = {
  fileDetails: {
    code: `<FileDetails
  collectionSlug="media"
  doc={doc}
  hideRemoveFile
  uploadConfig={uploadConfig}
/>`,
    design: {
      code: `.file-details {
  background: #f9f8ff;
  border: 1px solid #c8c0ff;
  border-radius: 8px;
}

.file-details__thumbnail {
  border-radius: 6px;
}`,
      description:
        'Customize the FileDetails surface and thumbnail while preserving its metadata, copy, adjustment, and removal behavior.',
      variables: [
        { name: 'background', description: 'File summary surface.' },
        { name: 'border', description: 'File summary outline.' },
        { name: 'border-radius', description: 'Summary and thumbnail corner radius.' },
      ],
    },
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
    code: `<PreviewSizes doc={doc} uploadConfig={uploadConfig} />`,
    design: {
      code: `.preview-sizes__sizeOption:hover,
.preview-sizes--selected {
  background: #f3f1ff;
}

.preview-sizes__imageWrap {
  border-color: #c8c0ff;
}`,
      description:
        'Target the selected size and structural regions to align the PreviewSizes browser with a project’s media treatment.',
      variables: [
        { name: 'background', description: 'Selected and hovered size surface.' },
        { name: 'border-color', description: 'Divider between the preview and size list.' },
      ],
    },
    render: () => (
      <div className={classes.previewSizesDemo}>
        <PreviewSizes doc={doc as never} uploadConfig={uploadConfig as never} />
      </div>
    ),
  },
}
