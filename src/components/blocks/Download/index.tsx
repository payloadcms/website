import { DownloadBlockType } from '@root/payload-types'
import classes from './index.module.scss'
import { Media } from '@components/Media'
import { CopyButton, DownloadButton } from './Buttons'

export const Download: React.FC<DownloadBlockType> = ({ downloads }) => {
  return (
    <div className={classes.wrapper}>
      {downloads &&
        downloads.map(
          ({
            id,
            name,
            file,
            thumbnailAppearance,
            background,
            thumbnail,
            copyToClipboard,
            copyToClipboardText,
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
                    resource={imageToUse}
                    className={[classes.downloadCardThumbnail, classes[background]].join(' ')}
                    imgClassName={classes[thumbnailAppearance]}
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
