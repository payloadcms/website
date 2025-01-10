import React from 'react'

import classes from '../index.module.scss'

export const VimeoPlayer: React.FC<{
  videoID?: string
}> = ({ videoID }) => {
  return (
    <iframe
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      className={classes.iframe}
      frameBorder="0"
      src={`https://player.vimeo.com/video/${videoID}}`}
      title="Vimeo player"
    />
  )
}
