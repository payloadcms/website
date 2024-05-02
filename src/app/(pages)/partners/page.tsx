import { BackgroundGrid } from '@components/BackgroundGrid'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar'
import { PartnerDirectory } from '@components/PartnerDirectory'
import { PartnerGrid } from '@components/PartnerGrid'
import { RenderBlocks } from '@components/RenderBlocks'
import { RichText } from '@components/RichText'
import { fetchPartnerProgram, fetchPartners } from '@root/app/_graphql'

import classes from './index.module.scss'

export default async function Partners() {
  const partnerProgram = await fetchPartnerProgram()

  if (!partnerProgram) {
    console.log('No partner program found') // eslint-disable-line no-console
  }
  const partners = await fetchPartners()
  const { hero, featuredPartners, contentBlocks } = partnerProgram

  const hasHeroLinks = hero?.heroLinks && hero.heroLinks.length > 0

  const breadcrumbBarLinks =
    (hero?.breadcrumbBarLinks && hero?.breadcrumbBarLinks.map(({ link }) => link)) ?? []

  return (
    <div className={classes.wrapper}>
      <BreadcrumbsBar
        breadcrumbs={[
          {
            url: '/partners',
            label: 'Agency Partners',
          },
        ]}
        links={breadcrumbBarLinks}
      />
      <Gutter className={[classes.hero, 'grid'].join(' ')}>
        <div className={[classes.heroContent, 'cols-8 start-5'].join(' ')}>
          <RichText content={hero?.richText} className={classes.heroRichText} />
          {hasHeroLinks && (
            <div className={[classes.links].filter(Boolean).join(' ')}>
              {hero.heroLinks &&
                hero.heroLinks.map(({ link }, i) => {
                  return (
                    <CMSLink
                      {...link}
                      key={i}
                      appearance="default"
                      fullWidth
                      buttonProps={{
                        icon: 'arrow',
                        hideHorizontalBorders: true,
                        hideBottomBorderExceptLast: true,
                      }}
                      className={classes.heroLink}
                    />
                  )
                })}
            </div>
          )}
        </div>
        <div className={[classes.featuredPartnersWrapper, 'cols-16'].join(' ')}>
          <div className={[classes.featuredPartnersHeader, 'cols-16 grid'].join(' ')}>
            <h2 className="cols-12">Featured Partners</h2>
            <p className="cols-4 start-13">{featuredPartners.description}</p>
          </div>
          <PartnerGrid partners={featuredPartners.partners} featured />
        </div>
        <BackgroundGrid />
      </Gutter>
      {contentBlocks?.beforeDirectory && <RenderBlocks blocks={contentBlocks?.beforeDirectory} />}
      <PartnerDirectory partners={partners} />
      {contentBlocks?.afterDirectory && <RenderBlocks blocks={contentBlocks?.afterDirectory} />}
    </div>
  )
}
