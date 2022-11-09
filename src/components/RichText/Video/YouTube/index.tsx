import React from 'react'
import classes from '../index.module.scss'

export const YouTubePlayer: React.FC<{
  videoID?: string
}> = ({ videoID }) => {
  return (
    <iframe
      title="YouTube player"
      className={classes.iframe}
      src={`https://www.youtube.com/embed/${videoID}`}
      frameBorder="0"
      allow="autoplay; fullscreen; accelerometer; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}
