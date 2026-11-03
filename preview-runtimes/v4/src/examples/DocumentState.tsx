'use client'
import { en } from '@payloadcms/translations/languages/en'
import { Button } from '@payloadcms/ui/elements/Button'
import { Locked } from '@payloadcms/ui/elements/Locked'
import { TranslationProvider } from '@payloadcms/ui/providers/Translation'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'
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
export const documentStateExamples: ComponentRenders = {
  lockedDocument: {
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
