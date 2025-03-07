'use client'
import type { CaseStudy, ReusableContent } from '@root/payload-types'

import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import { useMouseInfo } from '@faceless-ui/mouse-info'
import { PayloadIcon } from '@graphics/PayloadIcon/index'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import classes from './index.module.scss'

type Props = Extract<ReusableContent['layout'][0], { blockType: 'caseStudiesHighlight' }>

export const CaseStudiesHighlightBlock: React.FC<Props> = ({
  caseStudiesHighlightFields: { caseStudies: allCaseStudies, richText },
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
      rows.push(caseStudies.slice(n, n + 3))
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
                <ul className={classes.row} key={i}>
                  {row.map((caseStudy) => {
                    const { slug, featuredImage } = caseStudy

                    let url
                    let alt

                    if (typeof featuredImage === 'object' && featuredImage !== null) {
                      url = featuredImage.url
                      alt = featuredImage.alt
                    }

                    return (
                      <li className={classes.imageWrap} key={slug}>
                        <Link
                          className={classes.image}
                          href={`/case-studies/${slug}`}
                          prefetch={false}
                        >
                          <Image alt={alt} fill src={`${process.env.NEXT_PUBLIC_CMS_URL}${url}`} />
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
