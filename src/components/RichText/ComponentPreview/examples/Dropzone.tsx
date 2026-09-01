'use client'

import { Button } from '@payloadcms/ui/elements/Button'
import { Dropzone } from '@payloadcms/ui/elements/Dropzone'
import { useRef, useState } from 'react'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

const Demo = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileNames, setFileNames] = useState<string[]>([])

  const selectFiles = (files: FileList) => {
    setFileNames(Array.from(files, (file) => file.name))
  }

  return (
    <div className={classes.componentWidth}>
      <Dropzone multipleFiles onChange={selectFiles}>
        <div className={classes.dropzoneContent}>
          <Button
            buttonStyle="secondary"
            margin={false}
            onClick={() => inputRef.current?.click()}
            size="small"
          >
            Select files
          </Button>
          <input
            aria-label="Select files"
            hidden
            multiple
            onChange={(event) => event.target.files && selectFiles(event.target.files)}
            ref={inputRef}
            type="file"
          />
          <span>{fileNames.length ? fileNames.join(', ') : 'or drag and drop files here'}</span>
        </div>
      </Dropzone>
    </div>
  )
}

export const dropzoneExamples: ComponentExamples = {
  basic: {
    code: `const inputRef = useRef<HTMLInputElement>(null)
const [fileNames, setFileNames] = useState<string[]>([])

const selectFiles = (files: FileList) => {
  setFileNames(Array.from(files, (file) => file.name))
}

<Dropzone multipleFiles onChange={selectFiles}>
  <Button
    buttonStyle="secondary"
    margin={false}
    onClick={() => inputRef.current?.click()}
    size="small"
  >
    Select files
  </Button>
  <input
    aria-label="Select files"
    hidden
    multiple
    onChange={(event) => event.target.files && selectFiles(event.target.files)}
    ref={inputRef}
    type="file"
  />
  <span>{fileNames.length ? fileNames.join(', ') : 'or drag and drop files here'}</span>
</Dropzone>`,
    render: () => <Demo />,
  },
}
