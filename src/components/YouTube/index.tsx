import React from 'react'

import classes from './index.module.scss'

type Props = {
  id: string
  title: string
}

const YouTube: (props: Props) => React.JSX.Element = ({ id, title }) => (
  <div className={classes.wrap}>
    <div className={classes.innerWrap}>
      <iframe
        allow="autoplay;"
        allowFullScreen
        className={classes.iframe}
        frameBorder="0"
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
      />
    </div>
  </div>
)

export default YouTube
