import * as React from 'react'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'
import { CMSLink } from '@components/CMSLink'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'caseStudyCards' }>

export const CaseStudyCards: React.FC<Props> = props => {
  const { caseStudyCardFields } = props

  if (caseStudyCardFields.cards.length > 0) {
    return (
      <Gutter>
        {caseStudyCardFields.cards.map((card, i) => {
          return (
            <CMSLink
              url={`/case-studies/${typeof card.caseStudy !== 'string' ? card.caseStudy.slug : ''}`}
              key={i}
              className={classes.card}
            >
              <div className={classes.content}>
                <RichText content={card.richText} />
              </div>
              <div className={classes.media}>
                {typeof card.caseStudy !== 'string' &&
                  typeof card.caseStudy.featuredImage !== 'string' && (
                    <Media resource={card.caseStudy.featuredImage} fill />
                  )}
              </div>
            </CMSLink>
          )
        })}
      </Gutter>
    )
  }

  return null
}
