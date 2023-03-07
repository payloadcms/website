import { Button } from '@components/Button'
import { Heading } from '@components/Heading'
import * as React from 'react'

import classes from './index.module.scss'

type Props = {
  title: string
  link?: string
}
export const SectionHeader: React.FC<Props> = ({ title, link }) => {
  return (
    <div className={classes.sectionHeader}>
      <Heading element="h2" as="h5" margin={false}>
        {title}
      </Heading>

      {link && <Button label="learn more" icon="arrow" el="link" href={link} />}
    </div>
  )
}
