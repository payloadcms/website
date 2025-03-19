import React from 'react'

import classes from '../index.module.scss'

export const YouTubePlayer: React.FC<{
  start?: number
  videoID?: string
}> = ({ start, videoID }) => {
  return (
    <iframe
      allow="autoplay; fullscreen; accelerometer; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className={classes.iframe}
      src={`https://www.youtube-nocookie.com/embed/${videoID}${start ? `?start=${start}` : ''}`}
      title="YouTube player"
    />
  )
}
