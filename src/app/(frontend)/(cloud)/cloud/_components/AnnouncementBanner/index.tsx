import Link from 'next/link'

import classes from './index.module.scss'

export const AnnouncementBanner = () => {
  return (
    <div className={classes.announcementBanner}>
      <p>
        Payload is joining Figma!&nbsp;&nbsp;
        <Link href="/payload-has-joined-figma">Read the announcement</Link>
      </p>
    </div>
  )
}
