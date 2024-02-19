import * as React from 'react'

import { Button } from '@components/Button'
import { Heading } from '@components/Heading'

import classes from './index.module.scss'

type Props = {
  title: string
  link?: string
  intro?: React.ReactNode
  className?: string
}
export const SectionHeader: React.FC<Props> = ({ title, link, intro, className }) => {
  return (
    <div className={[classes.sectionHeader, className].filter(Boolean).join(' ')}>
      <div className={classes.titleAndLink}>
        <Heading element="h2" as="h4" margin={false}>
          {title}
        </Heading>

        {link && <Button label="learn more" icon="arrow" el="link" href={link} />}
      </div>

      {intro && <div className={classes.intro}>{intro}</div>}
    </div>
  )
}
