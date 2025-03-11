import type { DownloadBlockType } from '@root/payload-types'

import { Media } from '@components/Media'

import { CopyButton, DownloadButton } from './Buttons'
import classes from './index.module.scss'

export const Download: React.FC<DownloadBlockType> = ({ downloads }) => {
  return (
    <div className={classes.wrapper}>
      {downloads &&
        downloads.map(
          ({
            id,
            name,
            background,
            copyToClipboard,
            copyToClipboardText,
            file,
            thumbnail,
            thumbnailAppearance,
          }) => {
            const imageToUse =
              thumbnail && typeof thumbnail === 'object'
                ? thumbnail
                : file && typeof file === 'object'
                  ? file
                  : null
            return (
              <div className={classes.downloadCard} key={id}>
                {imageToUse && (
                  <Media
                    className={[classes.downloadCardThumbnail, classes[background]].join(' ')}
                    imgClassName={classes[thumbnailAppearance]}
                    resource={imageToUse}
                  />
                )}
                <div className={classes.downloadCardInfo}>
                  <span className={classes.downloadCardName}>{name}</span>
                  {copyToClipboard && copyToClipboardText && (
                    <CopyButton value={copyToClipboardText} />
                  )}
                  <DownloadButton file={file} />
                </div>
              </div>
            )
          },
        )}
    </div>
  )
}
