import React from 'react'

import classes from './index.module.scss'

export const DiscordGitBody: React.FC<{ body?: string; platform?: 'Discord' | 'GitHub' }> = ({
  body,
  platform,
}) => {
  return (
    <div
      className={[classes.body, platform && classes[platform]].filter(Boolean).join(' ')}
      dangerouslySetInnerHTML={{ __html: body || '' }}
    />
  )
}
