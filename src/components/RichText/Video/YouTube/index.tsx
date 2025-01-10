import React from 'react'

import classes from '../index.module.scss'

export const YouTubePlayer: React.FC<{
  videoID?: string
}> = ({ videoID }) => {
  return (
    <iframe
      allow="autoplay; fullscreen; accelerometer; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className={classes.iframe}
      frameBorder="0"
      src={`https://www.youtube-nocookie.com/embed/${videoID}`}
      title="YouTube player"
    />
  )
}
