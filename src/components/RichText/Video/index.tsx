import React from 'react'

import { VimeoPlayer } from './Vimeo/index.js'
import { YouTubePlayer } from './YouTube/index.js'
import classes from './index.module.scss'

export const Video: React.FC<{
  id?: string
  platform?: 'vimeo' | 'youtube'
}> = props => {
  const { id, platform = 'vimeo' } = props

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
