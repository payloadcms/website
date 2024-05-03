import Link from 'next/link'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { Text } from '@components/CMSForm/fields/Text'
import { Textarea } from '@components/CMSForm/fields/Textarea'
import { ContributionTable } from '@components/ContributionTable'
import { Gutter } from '@components/Gutter'
import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { fetchPartner } from '@root/app/_graphql'
import { ArrowIcon } from '@root/icons/ArrowIcon'

import classes from './index.module.scss'

export default async function PartnerPage({ params }: { params: { slug: string } }) {
  const partner = await fetchPartner(params.slug)

  if (!partner) {
    return null
  }

  const { bannerImage, overview, idealProject, caseStudy, contributions, projects } =
    partner.content

  return (
    <div className={classes.wrapper}>
      <BreadcrumbsBar
        breadcrumbs={[
          {
            url: '/partners',
            label: 'Partners',
          },
          {
            label: partner.name,
          },
        ]}
        links={[
          { url: '#contact', label: 'Contact' },
          { url: partner.website, label: 'Visit Website', newTab: true },
        ]}
      />
      <Gutter className={[classes.hero, 'grid'].join(' ')}>
        <aside className={[classes.sidebar, 'cols-3'].join(' ')}>
          <div className={classes.badges}>
            {partner.featured && <div className={classes.featured}>Featured</div>}
            {partner.badges?.map((badge, index) => (
              <div className={classes.badge} key={index + badge}>
                {badge}
              </div>
            ))}
          </div>
          <div className={classes.sidebarGroup}>
            <h6>Location</h6>
            <small>{partner.city}</small>
          </div>
          <div className={classes.sidebarGroup}>
            <h6>Regions</h6>
            <ul>
              {partner.regions?.map((region, index) => (
                <li key={index + region}>{region}</li>
              ))}
            </ul>
          </div>
          <div className={classes.sidebarGroup}>
            <h6>Industries</h6>
            <ul>
              {partner.industries?.map((industry, index) => (
                <li key={index + industry}>{industry}</li>
              ))}
            </ul>
          </div>
          <div className={classes.sidebarGroup}>
            <h6>Budgets</h6>
            <ul>
              {partner.budgets?.map((budget, index) => (
                <li key={index + budget}>{budget}</li>
              ))}
            </ul>
          </div>
          <div className={classes.sidebarGroup}>
            <h6>Technologies</h6>
            <ul>
              {partner.technologies?.map((technology, index) => (
                <li key={index + technology}>{technology}</li>
              ))}
            </ul>
          </div>
          {/* <div className={classes.sidebarGroup}>
            <h6>Social</h6>
            <ul>
              {partner.social?.map((social, index) => (
                <li key={index + social.platform}>
                  <a href={social.url} target="_blank" rel="noreferrer">
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}
        </aside>
        <main className={[classes.main, 'cols-10 start-4'].join(' ')}>
          <h1 className={classes.name}>{partner.name}</h1>
          {bannerImage && typeof bannerImage !== 'string' && (
            <Media resource={bannerImage} className={classes.banner} />
          )}
          <div className={classes.textBlock}>
            <h3>Overview</h3>
            <RichText content={overview} />
          </div>
          <div className={classes.textBlock}>
            <h3>Ideal Project</h3>
            <RichText content={idealProject} />
          </div>
          {caseStudy && typeof caseStudy !== 'string' && (
            <Link href={`/case-studies/${caseStudy.slug}`} className={classes.caseStudy}>
              <div className={classes.caseStudyText}>
                <h6>Case Study</h6>
                <h4>{caseStudy.meta?.title}</h4>
                <small>{caseStudy.meta?.description}</small>
              </div>
              <div className={classes.caseStudyImage}>
                {typeof caseStudy.featuredImage !== 'string' && (
                  <Media resource={caseStudy.featuredImage} />
                )}
              </div>
              <BackgroundScanline
                crosshairs={['top-left', 'bottom-right']}
                className={classes.scanlines}
              />
            </Link>
          )}
          {contributions && (
            <div className={classes.contributions}>
              <h3>Contributions</h3>
              <ContributionTable contributions={contributions} />
            </div>
          )}
          {projects && (
            <div className={classes.projects}>
              <h3>Built with Payload</h3>
              <div className={classes.projectTable}>
                {projects.map((project, index) => (
                  <Link
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className={classes.project}
                    key={index + project.name}
                  >
                    <span className={classes.projectYear}>{project.year}</span>
                    <span className={classes.projectName}>{project.name}</span>
                    <ArrowIcon className={classes.arrow} />
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className={classes.contactForm}>
            <h3>Contact {partner.name}</h3>
            <form>
              <Text name="name" label="Name" />
              <Textarea name="message" label="Message" />
              <BackgroundScanline
                className={classes.formScanlines}
                enableBorders
                crosshairs={['top-left', 'bottom-right']}
              />
            </form>
          </div>
        </main>
      </Gutter>
      <BackgroundGrid wideGrid />
    </div>
  )
}
