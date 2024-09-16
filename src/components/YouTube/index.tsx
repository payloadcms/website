import React from 'react'

import classes from './index.module.scss'

type Props = {
  id: string
  title: string
}

const YouTube: (props) => React.JSX.Element = ({ id, title }) => (
  <div className={classes.wrap}>
    <div className={classes.innerWrap}>
      <iframe
        className={classes.iframe}
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        frameBorder="0"
        allow="autoplay;"
        allowFullScreen
      />
    </div>
  </div>
)

export default YouTube
