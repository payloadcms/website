import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { CMSForm } from '@components/CMSForm'
import { ContributionTable } from '@components/ContributionTable'
import { Gutter } from '@components/Gutter'
import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar'
import { Media } from '@components/Media'
import { Pill } from '@components/Pill'
import { RefreshRouteOnSave } from '@components/RefreshRouterOnSave/index'
import { RichText } from '@components/RichText'
import { SocialIcon } from '@components/SocialIcon'
import { fetchPartner, fetchPartnerProgram } from '@data'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import classes from './index.module.scss'

const getPartner = (slug, draft) =>
  draft ? fetchPartner(slug) : unstable_cache(fetchPartner, [`partner-${slug}`])(slug)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const partner = await getPartner(slug, draft)

  if (!partner) {
    return notFound()
  }

  return {
    description: `${partner.name} is a official Payload Agency partner. Learn more about their services, ideal projects, and contributions to the Payload community.`,
    title: `${partner.name} | Payload Partners`,
  }
}

export default async function PartnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const partner = await getPartner(slug, draft)
  const getPartnerProgram = unstable_cache(fetchPartnerProgram, ['partnerProgram'])
  const partnerProgram = await getPartnerProgram()

  if (!partner) {
    return notFound()
  }
  if (!partnerProgram) {
    return notFound()
  }

  const { bannerImage, caseStudy, contributions, idealProject, overview, projects, services } =
    partner.content || {}

  const { contactForm } = partnerProgram

  return (
    <div className={classes.wrapper}>
      <RefreshRouteOnSave />
      <BreadcrumbsBar
        breadcrumbs={[
          {
            label: 'Partners',
            url: '/partners',
          },
          {
            label: partner.name,
          },
        ]}
        links={[
          { label: 'Contact', url: '#contact' },
          { label: 'Visit Website', newTab: true, url: partner.website },
        ]}
      />
      <Gutter className={[classes.hero, 'grid'].join(' ')}>
        <aside className={[classes.sidebar, 'cols-3'].join(' ')}>
          <PartnerDetails {...partner} />
        </aside>
        <main className={[classes.main, 'cols-10 start-4 cols-m-8 start-m-1'].join(' ')}>
          <h1 className={classes.name}>{partner.name}</h1>
          {bannerImage && typeof bannerImage !== 'string' && (
            <Media className={classes.banner} resource={bannerImage} />
          )}
          <div className={classes.detailsMobile}>
            <PartnerDetails {...partner} />
          </div>
          <div className={classes.textBlock}>
            <h3>Overview</h3>
            <RichText content={overview} />
          </div>
          <div className={classes.textBlock}>
            <h3>Services</h3>
            <RichText content={services} />
          </div>
          <div className={classes.textBlock}>
            <h3>Ideal Project</h3>
            <RichText content={idealProject} />
          </div>
          {caseStudy && typeof caseStudy !== 'string' && (
            <Link className={classes.caseStudy} href={`/case-studies/${caseStudy.slug}`}>
              <div className={classes.caseStudyText}>
                <h6>
                  Case Study <ArrowIcon className={classes.arrow} />
                </h6>
                <h4>{caseStudy.title}</h4>
                <small>{caseStudy.meta?.description}</small>
              </div>
              <div className={classes.caseStudyImage}>
                {typeof caseStudy.featuredImage !== 'string' && (
                  <Media resource={caseStudy.featuredImage} />
                )}
              </div>
              <BackgroundScanline
                className={classes.scanlines}
                crosshairs={['top-left', 'bottom-right']}
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
                    className={classes.project}
                    href={project.link}
                    key={index + project.name}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className={classes.projectYear}>{project.year}</span>
                    <span className={classes.projectName}>{project.name}</span>
                    <ArrowIcon className={classes.arrow} />
                  </Link>
                ))}
              </div>
            </div>
          )}
          {contactForm && typeof contactForm !== 'string' && (
            <div className={classes.contactForm} id="contact">
              <h3>Contact {partner.name}</h3>
              <div className={classes.form}>
                <CMSForm
                  form={{
                    ...contactForm,
                    fields: contactForm.fields?.map((field) => {
                      if (field.blockType === 'text' && field.name === 'toName') {
                        return {
                          ...field,
                          defaultValue: partner.name,
                        }
                      }
                      if (field.blockType === 'email' && field.name === 'toEmail') {
                        return {
                          ...field,
                          defaultValue: partner.email,
                        }
                      }
                      return field
                    }),
                  }}
                  hiddenFields={['toName', 'toEmail']}
                />
              </div>
              <BackgroundScanline className={classes.scanlines} />
            </div>
          )}
        </main>
      </Gutter>
      <BackgroundGrid wideGrid />
    </div>
  )
}

const PartnerDetails = (partner) => {
  const { budgets, city, featured, industries, regions, social, specialties, topContributor } =
    partner

  const sortedBudgets = budgets.sort((a, b) => a.value.localeCompare(b.value))

  return (
    <React.Fragment>
      {featured ||
        (topContributor && (
          <div className={classes.badges}>
            {featured && <Pill color="warning" text="Featured Partner" />}
            {topContributor && <Pill color="success" text="Top Contributor" />}
          </div>
        ))}
      <div className={classes.sidebarGroup}>
        <h6>Location</h6>
        <small>{city}</small>
      </div>
      <div className={classes.sidebarGroup}>
        <h6>Region{regions.length === 1 ? '' : 's'}</h6>
        <ul>
          {regions?.map(
            (region) => typeof region !== 'string' && <li key={region.id}>{region.name}</li>,
          )}
        </ul>
      </div>
      <div className={classes.sidebarGroup}>
        <h6>Industr{industries.length === 1 ? 'y' : 'ies'}</h6>
        <ul>
          {industries?.map(
            (industry) =>
              typeof industry !== 'string' && <li key={industry.id}>{industry.name}</li>,
          )}
        </ul>
      </div>
      <div className={classes.sidebarGroup}>
        <h6>Specialt{specialties.length === 1 ? 'y' : 'ies'}</h6>
        <ul>
          {specialties?.map(
            (specialty) =>
              typeof specialty !== 'string' && <li key={specialty.id}>{specialty.name}</li>,
          )}
        </ul>
      </div>
      <div className={classes.sidebarGroup}>
        <h6>Budget</h6>
        {sortedBudgets[0].name.split('–')[0] +
          '–' +
          (sortedBudgets.at(-1).name.split('–')[1] ?? sortedBudgets.at(-1).name)}
      </div>
      {social.length > 0 && (
        <div className={classes.sidebarGroup}>
          <h6>Social</h6>
          <ul className={classes.socialIcons}>
            {social?.map(
              (social) =>
                typeof social !== 'string' && (
                  <SocialIcon href={social.url} key={social.id} platform={social.platform} />
                ),
            )}
          </ul>
        </div>
      )}
    </React.Fragment>
  )
}
