import React from 'react'
import NextImageImport from 'next/image.js'
const Image = (NextImageImport.default ||
  NextImageImport) as unknown as typeof NextImageImport.default

import { Drawer, DrawerToggler } from '@components/Drawer/index.js'
import YouTube from '@components/YouTube/index.js'
import { ArrowIcon } from '@root/icons/ArrowIcon/index.js'
import { PlayIcon } from '@root/icons/PlayIcon/index.js'

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
              style={{ objectFit: 'cover', objectPosition: 'left', opacity: 0.85 }}
              fill
            />
            <PlayIcon className={classes.playIcon} size="large" />
          </div>
          <div className={classes.labelWrap}>
            <strong>{label}</strong>
            <ArrowIcon className={classes.arrow} />
          </div>
        </div>
      </DrawerToggler>

      <Drawer slug={drawerSlug} size="m" title={drawerTitle}>
        <YouTube id={`${id}?autoplay=1`} title={drawerTitle || ''} />
      </Drawer>
    </>
  )
}
