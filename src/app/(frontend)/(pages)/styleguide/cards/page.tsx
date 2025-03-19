import type { Metadata } from 'next'

import { Gutter } from '@components/Gutter/index'
import { ProjectCard } from '@root/app/(frontend)/(cloud)/cloud/_components/ProjectCard/index'
import React from 'react'

import { StyleguidePageContent } from '../PageContent/index'

const Cards: React.FC = () => {
  return (
    <StyleguidePageContent darkModeMargins darkModePadding title="Cards">
      <Gutter>
        <p>Project Card</p>
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div className={['cols-4 cols-s-4'].filter(Boolean).join(' ')}>
            <ProjectCard
              project={{
                name: 'Draft Project Title',
                slug: 'draft-slug',
                deploymentBranch: 'main',
                repositoryFullName: 'github.com/owner/repo',
                status: 'draft',
              }}
            />
          </div>
          <div className={['cols-4 cols-s-4'].filter(Boolean).join(' ')}>
            <ProjectCard
              project={{
                name: 'Project Title',
                slug: 'project-slug',
                deploymentBranch: 'main',
                repositoryFullName: 'github.com/owner/repo',
                status: 'published',
              }}
            />
          </div>
          <div className={['cols-4 cols-s-4'].filter(Boolean).join(' ')}>
            <ProjectCard
              project={{
                name: 'Trial Project Title',
                slug: 'trail-slug',
                deploymentBranch: 'main',
                repositoryFullName: 'github.com/owner/repo',
                stripeSubscriptionStatus: 'trialing',
              }}
            />
          </div>
          <div className={['cols-4 cols-s-4'].filter(Boolean).join(' ')}>
            <ProjectCard
              project={{
                name: 'Pro Project Title',
                slug: 'pro-slug',
                deploymentBranch: 'main',
                repositoryFullName: 'github.com/owner/repo',
                // @ts-expect-error
                plan: {
                  slug: 'pro',
                },
              }}
            />
          </div>
          <div className={['cols-4 cols-s-4'].filter(Boolean).join(' ')}>
            <ProjectCard
              project={{
                name: 'Enterprise Project Title',
                slug: 'enterprise-slug',
                deploymentBranch: 'main',
                repositoryFullName: 'github.com/owner/repo',
                // @ts-expect-error
                plan: {
                  slug: 'enterprise',
                },
              }}
            />
          </div>
          <div className={['cols-4 cols-s-4'].filter(Boolean).join(' ')}>
            <ProjectCard
              project={{
                name: 'Past Due Project Title',
                slug: 'past-due-slug',
                deploymentBranch: 'main',
                repositoryFullName: 'github.com/owner/repo',
                stripeSubscriptionStatus: 'past_due',
              }}
            />
          </div>
          <div className={['cols-4 cols-s-4'].filter(Boolean).join(' ')}>
            <ProjectCard
              project={{
                name: 'Unpaid Project Title',
                slug: 'unpaid-slug',
                deploymentBranch: 'main',
                repositoryFullName: 'github.com/owner/repo',
                stripeSubscriptionStatus: 'unpaid',
              }}
            />
          </div>
        </div>
      </Gutter>
    </StyleguidePageContent>
  )
}

export default Cards

export const metadata: Metadata = {
  title: 'Cards',
}
