'use client'

import { Button } from '@payloadcms/ui/elements/Button'
import { Locked } from '@payloadcms/ui/elements/Locked'
import { TranslationProvider } from '@payloadcms/ui/providers/Translation'
import { en } from 'payload/i18n/en'

import type { ComponentDesign, ComponentExamples } from './types'

import classes from '../examples.module.scss'

const modalStateDesign: ComponentDesign = {
  code: `.document-locked,
.document-take-over {
  background: rgb(255 255 255 / 88%);
  backdrop-filter: blur(8px);
}

.document-locked__wrapper,
.document-take-over__wrapper {
  border: 1px solid #c8c0ff;
  border-radius: 8px;
}`,
  description:
    'Target each document-state surface and its inner wrapper to customize the interruption without changing its permission or navigation behavior.',
  variables: [
    { name: 'background', description: 'Surface displayed over the interrupted Edit View.' },
    { name: 'backdrop-filter', description: 'Visual separation from the underlying document.' },
    { name: 'border', description: 'Optional outline around the state message.' },
    { name: 'border-radius', description: 'State message corner radius.' },
  ],
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

export const documentStateExamples: ComponentExamples = {
  lockedDocument: {
    code: `<DocumentLocked
  handleGoBack={() => router.back()}
  isActive={isLocked}
  onReadOnly={() => setReadOnly(true)}
  onTakeOver={takeOverDocument}
  updatedAt={lockedAt}
  user={lockingUser}
/>`,
    design: modalStateDesign,
    render: () => (
      <div className={classes.documentStatePanel}>
        <div className="document-locked__wrapper">
          <div className="document-locked__content">
            <h2>Document locked</h2>
            <p>
              <strong>editor@example.com</strong> is currently editing this document. If you take
              over, they will be blocked from continuing to edit, and may also lose unsaved changes.
            </p>
            <p>
              Edited since <strong>Sep 9, 4:18 PM</strong>
            </p>
          </div>
          <div className="document-locked__controls">
            <Button buttonStyle="secondary" margin={false}>
              Go back
            </Button>
            <Button buttonStyle="secondary" margin={false}>
              View read-only
            </Button>
            <Button margin={false}>Take over</Button>
          </div>
        </div>
      </div>
    ),
  },
  lockIndicator: {
    code: `<Locked user={lockingUser} />`,
    design: {
      code: `.locked {
  color: #6d5dfc;
  background: #f3f1ff;
  border: 1px solid #c8c0ff;
  border-radius: 999px;
  padding: 0.35rem;
}`,
      description:
        'Style the compact Locked indicator directly while preserving its built-in editor tooltip.',
      variables: [
        { name: 'color', description: 'Lock icon color.' },
        { name: 'background', description: 'Indicator surface.' },
        { name: 'border', description: 'Indicator outline.' },
        { name: 'padding', description: 'Clickable area around the lock icon.' },
      ],
    },
    render: () => (
      <PreviewTranslationProvider>
        <Locked
          className={classes.lockIndicatorDemo}
          user={
            {
              id: 'editor-1',
              collection: 'users',
              email: 'editor@example.com',
            } as never
          }
        />
      </PreviewTranslationProvider>
    ),
  },
  takenOver: {
    code: `<DocumentTakeOver
  handleBackToDashboard={() => router.push('/admin')}
  isActive={hasLostEditAccess}
  onReadOnly={() => setReadOnly(true)}
/>`,
    design: modalStateDesign,
    render: () => (
      <div className={classes.documentStatePanel}>
        <div className="document-take-over__wrapper">
          <div className="document-take-over__content">
            <h2>Editing taken over</h2>
            <p>Another user has taken over editing this document.</p>
          </div>
          <div className="document-take-over__controls">
            <Button margin={false}>Back to Dashboard</Button>
            <Button buttonStyle="secondary" margin={false}>
              View read-only
            </Button>
          </div>
        </div>
      </div>
    ),
  },
}
