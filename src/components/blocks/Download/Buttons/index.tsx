'use client'

import { DownloadIcon } from '@graphics/DownloadIcon'
import { CopyIcon } from '@icons/CopyIcon'
import { DownloadBlockType, Media } from '@types'

import classes from '../index.module.scss'
import { Tooltip } from '@components/Tooltip'
import { useState } from 'react'
import { CheckIcon } from '@icons/CheckIcon'
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
        text={clicked ? 'Downloading!' : 'Download'}
        className={classes.button}
        onClick={handleClick}
        unstyled
      >
        <a href={file.url} download={file.filename} target="_blank">
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
      text={clicked ? 'Copied!' : 'Copy to clipboard'}
      className={classes.button}
      onClick={handleClick}
      unstyled
    >
      {clicked ? <CheckIcon /> : <CopyIcon />}
    </Tooltip>
  )
}
