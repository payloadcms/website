import React, { useState } from 'react'
import { useMouseInfo } from '@faceless-ui/mouse-info'
import { PayloadIcon } from '@graphics/PayloadIcon'
import Image from 'next/image'
import Link from 'next/link'

import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { CaseStudy, ReusableContent } from '@root/payload-types'

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
      <div className={classes.wrap}>
        <div className={classes.poweredByPayload}>
          <div className={classes.poweredByPayloadInner}>
            <PayloadIcon />
            Powered by Payload
          </div>
        </div>
        <div
          className={classes.inner}
          style={{
            transform: `translate3d(${(xPercentage - 50) * -0.1}%, 0, 0)`,
          }}
        >
          <div data-theme="darks">
            {caseStudyRows.map((row, i) => {
              return (
                <ul key={i} className={classes.row}>
                  {row.map(caseStudy => {
                    const { slug, featuredImage } = caseStudy

                    let url
                    let alt

                    if (typeof featuredImage === 'object' && featuredImage !== null) {
                      url = featuredImage.url
                      alt = featuredImage.alt
                    }

                    return (
                      <li key={slug} className={classes.imageWrap}>
                        <Link
                          href={`/case-studies/${slug}`}
                          className={classes.image}
                          prefetch={false}
                        >
                          <Image src={`${process.env.NEXT_PUBLIC_CMS_URL}${url}`} fill alt={alt} />
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )
            })}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
