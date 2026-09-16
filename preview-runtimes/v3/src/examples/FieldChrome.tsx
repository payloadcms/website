'use client'

import { FieldDescription } from '@payloadcms/ui/fields/FieldDescription'
import { FieldError } from '@payloadcms/ui/fields/FieldError'
import { FieldLabel } from '@payloadcms/ui/fields/FieldLabel'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'
import { FieldPreviewProviders } from './FieldPreviewProviders'

export const fieldChromeExamples: ComponentRenders = {
  labels: {
    render: () => (
      <FieldPreviewProviders>
        <div className={`field-type text ${classes.fieldChromeField}`}>
          <FieldLabel htmlFor="project-name" label="Project name" required />
          <div className="field-type__wrap">
            <input
              aria-label="Project name"
              defaultValue="Payload website"
              id="project-name"
              type="text"
            />
          </div>
        </div>
      </FieldPreviewProviders>
    ),
  },
  messages: {
    render: () => (
      <FieldPreviewProviders>
        <div className={`field-type text error ${classes.fieldChromeField}`}>
          <FieldLabel htmlFor="project-slug" label="Project slug" required />
          <div className="field-type__wrap">
            <FieldError message="This field is required." path="projectSlug" showError />
            <input aria-invalid="true" aria-label="Project slug" id="project-slug" type="text" />
            <FieldDescription
              description="Use a short, recognizable slug for this project."
              path="projectSlug"
            />
          </div>
        </div>
      </FieldPreviewProviders>
    ),
  },
}
