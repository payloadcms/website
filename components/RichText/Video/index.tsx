import React from 'react'
import classes from './index.module.scss'
import { VimeoPlayer } from './Vimeo'
import { YouTubePlayer } from './YouTube'

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
