'use client'

import { TimezonePicker } from '@payloadcms/ui/elements/TimezonePicker'
import { TranslationProvider } from '@payloadcms/ui/providers/Translation'
import { en } from 'payload/i18n/en'
import { useState } from 'react'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

const options = [
  { label: 'America/Detroit', value: 'America/Detroit' },
  { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
  { label: 'Europe/London', value: 'Europe/London' },
]

const Demo = () => {
  const [timezone, setTimezone] = useState('America/Detroit')

  return (
    <TranslationProvider
      dateFNSKey="en-US"
      fallbackLang="en"
      language="en"
      languageOptions={[{ label: 'English', value: 'en' }]}
      switchLanguageServerAction={() => Promise.resolve()}
      translations={en.translations}
    >
      <div className={classes.timezoneDemo}>
        <TimezonePicker
          id="component-preview-timezone"
          onChange={setTimezone}
          options={options}
          selectedTimezone={timezone}
        />
      </div>
    </TranslationProvider>
  )
}

export const timezonePickerExamples: ComponentExamples = {
  basic: {
    code: `const options = [
  { label: 'America/Detroit', value: 'America/Detroit' },
  { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
  { label: 'Europe/London', value: 'Europe/London' },
]

const [timezone, setTimezone] = useState('America/Detroit')

<TimezonePicker
  id="timezone"
  onChange={setTimezone}
  options={options}
  selectedTimezone={timezone}
/>`,
    render: () => <Demo />,
  },
}
