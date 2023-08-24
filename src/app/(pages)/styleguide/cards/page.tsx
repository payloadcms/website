import React from 'react'
import { ProjectCard } from '@cloud/_components/ProjectCard'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Metadata } from 'next'

import { Gutter } from '@components/Gutter'
import { StyleguidePageContent } from '../PageContent'

const Cards: React.FC = () => {
  return (
    <StyleguidePageContent title="Cards" darkModePadding darkModeMargins>
      <Gutter>
        <p>Project Card</p>
        <Grid>
          <Cell cols={4} colsS={4}>
            <ProjectCard
              project={{
                name: 'Draft Project Title',
                repositoryFullName: 'github.com/owner/repo',
                deploymentBranch: 'main',
                slug: 'draft-slug',
                status: 'draft',
              }}
            />
          </Cell>
          <Cell cols={4} colsS={4}>
            <ProjectCard
              project={{
                name: 'Project Title',
                repositoryFullName: 'github.com/owner/repo',
                deploymentBranch: 'main',
                slug: 'project-slug',
                status: 'published',
              }}
            />
          </Cell>
          <Cell cols={4} colsS={4}>
            <ProjectCard
              project={{
                name: 'Trial Project Title',
                repositoryFullName: 'github.com/owner/repo',
                deploymentBranch: 'main',
                slug: 'trail-slug',
                stripeSubscriptionStatus: 'trialing',
              }}
            />
          </Cell>
          <Cell cols={4} colsS={4}>
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
          </Cell>
          <Cell cols={4} colsS={4}>
            <ProjectCard
              project={{
                name: 'Past Due Project Title',
                repositoryFullName: 'github.com/owner/repo',
                deploymentBranch: 'main',
                slug: 'past-due-slug',
                stripeSubscriptionStatus: 'past_due',
              }}
            />
          </Cell>
          <Cell cols={4} colsS={4}>
            <ProjectCard
              project={{
                name: 'Unpaid Project Title',
                repositoryFullName: 'github.com/owner/repo',
                deploymentBranch: 'main',
                slug: 'unpaid-slug',
                stripeSubscriptionStatus: 'unpaid',
              }}
            />
          </Cell>
        </Grid>
      </Gutter>
    </StyleguidePageContent>
  )
}

export default Cards

export const metadata: Metadata = {
  title: 'Cards',
}
