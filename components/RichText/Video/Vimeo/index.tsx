import React from 'react'
import classes from '../index.module.scss'

export const VimeoPlayer: React.FC<{
  videoID?: string
}> = ({ videoID }) => {
  return (
    <iframe
      title="Vimeo player"
      className={classes.iframe}
      src={`https://player.vimeo.com/video/${videoID}}`}
      frameBorder="0"
      allowFullScreen
      allow="autoplay; fullscreen; picture-in-picture"
    />
  )
}
