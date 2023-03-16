import React from 'react'
import classes from './index.module.scss'

export const DiscordGitBody: React.FC<{ body?: string }> = ({ body }) => {
  return <div className={classes.body} dangerouslySetInnerHTML={{ __html: body || '' }} />
}
