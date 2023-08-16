/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Image from 'next/image'

import { Drawer, DrawerToggler } from '@components/Drawer'
import YouTube from '@components/YouTube'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { PlayIcon } from '@root/icons/PlayIcon'

import classes from './index.module.scss'

type Props = {
  id: string
  label?: string
  drawerTitle?: string
}

export const VideoDrawer: React.FC<Props> = ({ id, label, drawerTitle }) => {
  const drawerSlug = `video-drawer-${id}`

  return (
    <>
      <DrawerToggler className={classes.videoDrawerToggler} slug={drawerSlug}>
        <div className={classes.wrap}>
          <div className={classes.thumbnail}>
            <Image
              src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
              alt={drawerTitle || label || 'Video Thumbnail'}
              style={{ objectFit: 'cover', objectPosition: 'left', opacity: 0.75 }}
              fill
            />
            <PlayIcon className={classes.playIcon} size="large" />
          </div>
          <div className={classes.labelWrap}>
            <strong>{label}</strong>
            <ArrowIcon className={classes.arrow} size="medium" />
          </div>
        </div>
      </DrawerToggler>

      <Drawer slug={drawerSlug} size="m" title={drawerTitle}>
        <YouTube id={id} title={drawerTitle || ''} />
      </Drawer>
    </>
  )
}
