export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { CMSForm } from '@components/CMSForm'
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

  const { bannerImage, overview, services, idealProject, caseStudy, contributions, projects } =
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
          <PartnerDetails {...partner} />
        </aside>
        <main className={[classes.main, 'cols-10 start-4 cols-m-8 start-m-1'].join(' ')}>
          <h1 className={classes.name}>{partner.name}</h1>
          {bannerImage && typeof bannerImage !== 'string' && (
            <Media resource={bannerImage} className={classes.banner} />
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
            <div className={classes.contactForm} id="contact">
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

const PartnerDetails = partner => {
  const { featured, topContributor, city, regions, industries, budgets, specialties, social } =
    partner

  const sortedBudgets = budgets.sort((a, b) => a.value.localeCompare(b.value))

  return (
    <>
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
          {partner.regions?.map(
            region => typeof region !== 'string' && <li key={region.id}>{region.name}</li>,
          )}
        </ul>
      </div>
      <div className={classes.sidebarGroup}>
        <h6>Industr{industries.length === 1 ? 'y' : 'ies'}</h6>
        <ul>
          {industries?.map(
            industry => typeof industry !== 'string' && <li key={industry.id}>{industry.name}</li>,
          )}
        </ul>
      </div>
      <div className={classes.sidebarGroup}>
        <h6>Specialt{specialties.length === 1 ? 'y' : 'ies'}</h6>
        <ul>
          {specialties?.map(
            specialty =>
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
              social =>
                typeof social !== 'string' && (
                  <SocialIcon key={social.id} platform={social.platform} href={social.url} />
                ),
            )}
          </ul>
        </div>
      )}
    </>
  )
}
