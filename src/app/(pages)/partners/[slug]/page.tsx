import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { CMSForm } from '@components/CMSForm'
import { Text } from '@components/CMSForm/fields/Text'
import { Textarea } from '@components/CMSForm/fields/Textarea'
import { ContributionTable } from '@components/ContributionTable'
import { Gutter } from '@components/Gutter'
import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar'
import { Media } from '@components/Media'
import { Pill } from '@components/Pill'
import { RichText } from '@components/RichText'
import { SocialIcon } from '@components/SocialIcon'
import { fetchPartner, fetchPartnerProgram } from '@root/app/_graphql'
import { ArrowIcon } from '@root/icons/ArrowIcon'

import classes from './index.module.scss'

export default async function PartnerPage({ params }: { params: { slug: string } }) {
  const partner = await fetchPartner(params.slug)
  const partnerProgram = await fetchPartnerProgram()

  if (!partner) {
    return notFound()
  }
  if (!partnerProgram) {
    return notFound()
  }

  const { bannerImage, overview, idealProject, caseStudy, contributions, projects } =
    partner.content

  const { contactForm } = partnerProgram

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
            {partner.featured && <Pill color="warning" text="Featured Partner" />}
            {partner.topContributor && <Pill color="success" text="Top Contributor" />}
          </div>
          <div className={classes.sidebarGroup}>
            <h6>Location</h6>
            <small>{partner.city}</small>
          </div>
          <div className={classes.sidebarGroup}>
            <h6>Region{partner.regions.length === 1 ? '' : 's'}</h6>
            <ul>
              {partner.regions?.map(
                region => typeof region !== 'string' && <li key={region.id}>{region.name}</li>,
              )}
            </ul>
          </div>
          <div className={classes.sidebarGroup}>
            <h6>Industr{partner.industries.length === 1 ? 'y' : 'ies'}</h6>
            <ul>
              {partner.industries?.map(
                industry =>
                  typeof industry !== 'string' && <li key={industry.id}>{industry.name}</li>,
              )}
            </ul>
          </div>
          <div className={classes.sidebarGroup}>
            <h6>Budget{partner.budgets.length === 1 ? '' : 's'}</h6>
            <ul>
              {partner.budgets?.map(
                budget => typeof budget !== 'string' && <li key={budget.id}>{budget.name}</li>,
              )}
            </ul>
          </div>
          <div className={classes.sidebarGroup}>
            <h6>Specialt{partner.specialties.length === 1 ? 'y' : 'ies'}</h6>
            <ul>
              {partner.specialties?.map(
                specialty =>
                  typeof specialty !== 'string' && <li key={specialty.id}>{specialty.name}</li>,
              )}
            </ul>
          </div>
          <div className={classes.sidebarGroup}>
            <h6>Social</h6>
            <ul className={classes.socialIcons}>
              {partner.social?.map(
                social =>
                  typeof social !== 'string' && (
                    <SocialIcon key={social.id} platform={social.platform} href={social.url} />
                  ),
              )}
            </ul>
          </div>
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
          {contributions && contributions.length > 0 && (
            <div className={classes.contributions}>
              <h3>Contributions</h3>
              <ContributionTable contributions={contributions} />
            </div>
          )}
          {projects && projects.length > 0 && (
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
          {typeof contactForm !== 'string' && (
            <div className={classes.contactForm}>
              <h3>Contact {partner.name}</h3>
              <div className={classes.form}>
                <CMSForm
                  form={{
                    ...contactForm,
                    fields: contactForm.fields?.map(field => {
                      if (field.blockType === 'text' && field.name === 'toName') {
                        return {
                          ...field,
                          defaultValue: partner.name,
                          hidden: true,
                        }
                      }
                      if (field.blockType === 'email' && field.name === 'toEmail') {
                        return {
                          ...field,
                          defaultValue: partner.email,
                          hidden: true,
                        }
                      }
                      return field
                    }),
                  }}
                />
              </div>
              <BackgroundScanline
                crosshairs={['top-left', 'bottom-right']}
                className={classes.scanlines}
              />
            </div>
          )}
        </main>
      </Gutter>
      <BackgroundGrid wideGrid />
    </div>
  )
}
