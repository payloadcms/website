import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { useRouter } from 'next/navigation'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { LineDraw } from '@components/LineDraw'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { ScopeSelector } from '@components/ScopeSelector'
import { Install } from '@root/utilities/use-get-installs'
import { useCreateDraftProject } from '../../../utilities/use-create-draft-project'
import { useGetRepos } from '../../../utilities/use-get-repos'

import classes from './index.module.scss'

export const ImportProject: React.FC = () => {
  const [loadingInstalls, setLoadingInstalls] = React.useState<boolean>(true)
  const [installs, setInstalls] = React.useState<Install[]>()
  const [selectedInstall, setSelectedInstall] = React.useState<Install | undefined>(undefined)
  const router = useRouter()
  const [hoverIndex, setHoverIndex] = React.useState<number | undefined>(undefined)

  const {
    submitDraftProject,
    error: createError,
    isSubmitting,
  } = useCreateDraftProject({
    installID: selectedInstall?.id,
    onSubmit: ({ id: draftProjectID }) => {
      router.push(`/new/configure/${draftProjectID}`)
    },
  })

  const { loading: loadingRepos, repos } = useGetRepos({
    selectedInstall,
  })

  return (
    <Gutter>
      {createError && <p className={classes.error}>{createError}</p>}
      {isSubmitting && <LoadingShimmer number={3} />}
      {!isSubmitting && (
        <Grid>
          <Cell cols={4} colsM={8} className={classes.sidebarCell}>
            <div className={classes.sidebar}>
              <ScopeSelector
                value={selectedInstall?.id}
                onChange={setSelectedInstall}
                onInstalls={setInstalls}
                onLoading={setLoadingInstalls}
              />
              {/* <div>
            <p className={classes.label}>Search</p>
            <Text placeholder="Enter search term" />
          </div> */}
              <div>
                <p>
                  {`Don't see your repository? `}
                  <a href={selectedInstall?.html_url} rel="noopener noreferrer" target="_blank">
                    Adjust your GitHub app permissions
                  </a>
                  {'.'}
                </p>
              </div>
            </div>
          </Cell>
          <Cell cols={8} colsM={8}>
            {((loadingRepos && installs?.length > 0) || loadingInstalls) && (
              <LoadingShimmer number={3} />
            )}
            {!loadingInstalls && !loadingRepos && repos?.length > 0 && (
              <div className={classes.repos}>
                {repos?.map((repo, index) => {
                  const { name, description } = repo
                  const isHovered = hoverIndex === index
                  return (
                    <div
                      key={repo.id}
                      className={classes.repo}
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(undefined)}
                    >
                      <div className={classes.repoContent}>
                        <h6 className={classes.repoName}>{name}</h6>
                        {description && <p className={classes.repoDescription}>{description}</p>}
                      </div>
                      <Button
                        label="Import"
                        appearance="primary"
                        size="small"
                        onClick={() => {
                          submitDraftProject({ repo })
                        }}
                        disabled={isSubmitting}
                      />
                      <LineDraw align="bottom" active={isHovered} />
                    </div>
                  )
                })}
              </div>
            )}
            {!loadingInstalls && installs?.length > 0 && !loadingRepos && repos?.length === 0 && (
              <div className={classes.noRepos}>
                <h6>No repositories found</h6>
                <p>
                  {`No repositories were found in the account "${selectedInstall?.account.login}". Create a new repository or `}
                  <a href={selectedInstall?.html_url} rel="noopener noreferrer" target="_blank">
                    adjust your GitHub app permissions
                  </a>
                  {'.'}
                </p>
              </div>
            )}
            {!loadingInstalls && installs?.length === 0 && (
              <div className={classes.noRepos}>
                <h6>No installations found</h6>
                <p>
                  {`No installations were found under this profile. Click "Add GitHub Account" from the dropdown to install the Payload app and provide access to your repositories.`}
                </p>
              </div>
            )}
          </Cell>
        </Grid>
      )}
    </Gutter>
  )
}
