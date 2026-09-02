import { CodeEditor } from '@payloadcms/ui/elements/CodeEditor'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

const value = `{
  "title": "Payload UI",
  "enabled": true
}`

export const codeEditorExamples: ComponentExamples = {
  readOnly: {
    code: `<CodeEditor
  defaultLanguage="json"
  minHeight={110}
  readOnly
  value={'{\\n  "title": "Payload UI",\\n  "enabled": true\\n}'}
/>`,
    render: ({ theme }) => (
      <div className={classes.componentWidth}>
        <CodeEditor
          defaultLanguage="json"
          minHeight={110}
          readOnly
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          value={value}
        />
      </div>
    ),
  },
}
