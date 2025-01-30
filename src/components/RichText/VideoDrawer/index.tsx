import { Drawer, DrawerToggler } from '@components/Drawer/index.js'
import YouTube from '@components/YouTube/index.js'
import { ArrowIcon } from '@root/icons/ArrowIcon/index.js'
import { PlayIcon } from '@root/icons/PlayIcon/index.js'
import Image from 'next/image'
import React from 'react'

import classes from './index.module.scss'
type Props = {
  drawerTitle?: string
  id: string
  label?: string
}
export const VideoDrawer: React.FC<Props> = ({ id, drawerTitle, label }) => {
  const drawerSlug = `video-drawer-${id}`
  return (
    <>
      <DrawerToggler className={classes.videoDrawerToggler} slug={drawerSlug}>
        <div className={classes.wrap}>
          <div className={classes.thumbnail}>
            <Image
              alt={drawerTitle || label || 'Video Thumbnail'}
              fill
              src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
              style={{ objectFit: 'cover', objectPosition: 'left', opacity: 0.85 }}
            />
            <PlayIcon className={classes.playIcon} size="large" />
          </div>
          <div className={classes.labelWrap}>
            <strong>{label}</strong>
            <ArrowIcon className={classes.arrow} />
          </div>
        </div>
      </DrawerToggler>
      <Drawer size="m" slug={drawerSlug} title={drawerTitle}>
        <YouTube id={`${id}?autoplay=1`} title={drawerTitle || ''} />
      </Drawer>
    </>
  )
}
