import React from 'react'
import { Metadata } from 'next'

import { Gutter } from '@components/Gutter/index.js'
import { ProjectCard } from '@root/app/(frontend)/(cloud)/cloud/_components/ProjectCard/index.js'
import { StyleguidePageContent } from '../PageContent/index.js'

const Cards: React.FC = () => {
  return (
    <StyleguidePageContent title="Cards" darkModePadding darkModeMargins>
      <Gutter>
        <p>Project Card</p>
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div className={['cols-4 cols-s-4'].filter(Boolean).join(' ')}>
            <ProjectCard
              project={{
                name: 'Draft Project Title',
                repositoryFullName: 'github.com/owner/repo',
                deploymentBranch: 'main',
                slug: 'draft-slug',
                status: 'draft',
              }}
            />
          </div>
          <div className={['cols-4 cols-s-4'].filter(Boolean).join(' ')}>
            <ProjectCard
              project={{
                name: 'Project Title',
                repositoryFullName: 'github.com/owner/repo',
                deploymentBranch: 'main',
                slug: 'project-slug',
                status: 'published',
              }}
            />
          </div>
          <div className={['cols-4 cols-s-4'].filter(Boolean).join(' ')}>
            <ProjectCard
              project={{
                name: 'Trial Project Title',
                repositoryFullName: 'github.com/owner/repo',
                deploymentBranch: 'main',
                slug: 'trail-slug',
                stripeSubscriptionStatus: 'trialing',
              }}
            />
          </div>
          <div className={['cols-4 cols-s-4'].filter(Boolean).join(' ')}>
            <ProjectCard
              project={{
                name: 'Pro Project Title',
                repositoryFullName: 'github.com/owner/repo',
                deploymentBranch: 'main',
                slug: 'pro-slug',
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
                repositoryFullName: 'github.com/owner/repo',
                deploymentBranch: 'main',
                slug: 'enterprise-slug',
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
                repositoryFullName: 'github.com/owner/repo',
                deploymentBranch: 'main',
                slug: 'past-due-slug',
                stripeSubscriptionStatus: 'past_due',
              }}
            />
          </div>
          <div className={['cols-4 cols-s-4'].filter(Boolean).join(' ')}>
            <ProjectCard
              project={{
                name: 'Unpaid Project Title',
                repositoryFullName: 'github.com/owner/repo',
                deploymentBranch: 'main',
                slug: 'unpaid-slug',
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
