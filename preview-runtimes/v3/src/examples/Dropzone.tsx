'use client'

import { Button } from '@payloadcms/ui/elements/Button'
import { Dropzone } from '@payloadcms/ui/elements/Dropzone'
import { useRef, useState } from 'react'

import type { ComponentRenders } from './types'

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

const UploadEmptyStateDemo = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string>()

  const selectFile = (files: FileList) => {
    setFileName(files[0]?.name)
  }

  return (
    <div className={classes.componentWidth}>
      <Dropzone onChange={selectFile}>
        <div className={classes.uploadDropzoneContent}>
          <div className={classes.uploadDropzoneActions}>
            <Button
              buttonStyle="pill"
              margin={false}
              onClick={() => inputRef.current?.click()}
              size="small"
            >
              Select a file
            </Button>
            <input
              aria-label="Select a file"
              hidden
              onChange={(event) => event.target.files && selectFile(event.target.files)}
              ref={inputRef}
              type="file"
            />
            <span>or</span>
            <Button buttonStyle="pill" margin={false} size="small">
              Paste URL
            </Button>
          </div>
          <span>{fileName || 'or drag and drop a file'}</span>
        </div>
      </Dropzone>
    </div>
  )
}

export const dropzoneExamples: ComponentRenders = {
  basic: {
    render: () => <Demo />,
  },
  uploadEmptyState: {
    render: () => <UploadEmptyStateDemo />,
  },
}
