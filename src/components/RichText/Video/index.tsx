import React from 'react'

import { VimeoPlayer } from './Vimeo/index.js'
import { YouTubePlayer } from './YouTube/index.js'

import classes from './index.module.scss'

export const Video: React.FC<{
  platform?: 'vimeo' | 'youtube'
  id?: string
}> = props => {
  const { platform = 'vimeo', id } = props

  return (
    <div
      className={classes.videoPlayer}
      style={{
        paddingTop: '56.25%',
      }}
    >
      {platform === 'youtube' && <YouTubePlayer videoID={id} />}
      {platform === 'vimeo' && <VimeoPlayer videoID={id} />}
    </div>
  )
}
