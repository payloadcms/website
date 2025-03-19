import { Button } from '@components/Button/index'
import { Heading } from '@components/Heading/index'
import * as React from 'react'

import classes from './index.module.scss'

type Props = {
  className?: string
  intro?: React.ReactNode
  link?: string
  title: string
}
export const SectionHeader: React.FC<Props> = ({ className, intro, link, title }) => {
  return (
    <div className={[classes.sectionHeader, className].filter(Boolean).join(' ')}>
      <div className={classes.titleAndLink}>
        <Heading as="h3" element="h2" margin={false}>
          {title}
        </Heading>

        {link && <Button el="link" href={link} icon="arrow" label="Learn more" />}
      </div>

      {intro && <div className={classes.intro}>{intro}</div>}
    </div>
  )
}
