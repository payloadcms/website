import React, { useState } from 'react'
import { useMouseInfo } from '@faceless-ui/mouse-info'
import { RichText } from '@components/RichText'
import Image from 'next/image'
import { Button } from '@components/Button'
import { ThemeProvider } from '@components/providers/Theme'
import { CaseStudy, ReusableContent } from '../../../payload-types'
import { Gutter } from '../../Gutter'
import classes from './index.module.scss'

type Props = Extract<ReusableContent['layout'][0], { blockType: 'caseStudiesHighlight' }>

export const CaseStudiesHighlightBlock: React.FC<Props> = ({
  caseStudiesHighlightFields: { richText, caseStudies: allCaseStudies },
}) => {
  const { xPercentage } = useMouseInfo()

  const [caseStudyRows] = useState(() => {
    const caseStudies: CaseStudy[] = [...(allCaseStudies as CaseStudy[])]

    let i = 0

    while (caseStudies.length < 6) {
      caseStudies.push(caseStudies[i])
      i += 1
    }

    const rows: CaseStudy[][] = []

    for (let n = 0; n < caseStudies.length; n += 3) {
      rows.push((caseStudies as CaseStudy[]).slice(n, n + 3))
    }

    return rows
  })

  return (
    <React.Fragment>
      <Gutter>
        <RichText className={classes.content} content={richText} />
      </Gutter>
      <ThemeProvider theme="dark">
        <div className={classes.wrap}>
          <div
            className={classes.inner}
            style={{
              transform: `translate3d(${(xPercentage - 50) * -0.1}%, 0, 0)`,
            }}
          >
            {caseStudyRows.map((row, i) => {
              return (
                <ul key={i} className={classes.row}>
                  {row.map(caseStudy => {
                    const { slug, featuredImage } = caseStudy

                    let url
                    let alt

                    if (typeof featuredImage === 'object') {
                      url = featuredImage.url
                      alt = featuredImage.alt
                    }

                    return (
                      <li key={slug} className={classes.imageWrap}>
                        <div className={classes.image}>
                          <Image src={`${process.env.NEXT_PUBLIC_CMS_URL}${url}`} fill alt={alt} />
                          <div className={classes.button}>
                            <Button
                              href={`/case-studies/${slug}`}
                              el="link"
                              label="Read case study"
                              labelStyle="mono"
                              appearance="primary"
                            />
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )
            })}
          </div>
        </div>
      </ThemeProvider>
    </React.Fragment>
  )
}
