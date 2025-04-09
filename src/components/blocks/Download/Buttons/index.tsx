'use client'

import type { DownloadBlockType } from '@types'

import { Tooltip } from '@components/Tooltip'
import { DownloadIcon } from '@graphics/DownloadIcon'
import { CheckIcon } from '@icons/CheckIcon'
import { CopyIcon } from '@icons/CopyIcon'
import { Media } from '@types'
import { useState } from 'react'

import classes from '../index.module.scss'
export const DownloadButton: React.FC<{
  file: NonNullable<DownloadBlockType['downloads']>[0]['file']
}> = ({ file }) => {
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 1000)
  }

  if (typeof file !== 'string' && file.url) {
    return (
      <Tooltip
        className={classes.button}
        onClick={handleClick}
        text={clicked ? 'Downloading!' : 'Download'}
        unstyled
      >
        <a download={file.filename} href={file.url} target="_blank">
          {clicked ? <CheckIcon /> : <DownloadIcon />}
        </a>
      </Tooltip>
    )
  }
  return null
}

export const CopyButton: React.FC<{
  value: string
}> = ({ value }) => {
  const [clicked, setClicked] = useState(false)
  const handleClick = () => {
    navigator.clipboard.writeText(value)
    setClicked(true)
    setTimeout(() => setClicked(false), 1000)
  }

  return (
    <Tooltip
      className={classes.button}
      onClick={handleClick}
      text={clicked ? 'Copied!' : 'Copy to clipboard'}
      unstyled
    >
      {clicked ? <CheckIcon /> : <CopyIcon />}
    </Tooltip>
  )
}
