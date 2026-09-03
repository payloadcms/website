import type { Page } from '@types'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper, type PaddingProps } from '@components/BlockWrapper/index'
import { Gutter } from '@components/Gutter'
import React from 'react'

import classes from './index.module.scss'

type VersionSupportTableProps = {
  hideBackground?: boolean
  padding?: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'versionSupportTable' }>

export const VersionSupportTable: React.FC<VersionSupportTableProps> = (props) => {
  const { padding, versionSupportTableFields } = props
  const { description, heading, rows, settings } = versionSupportTableFields || {}

  return (
    <BlockWrapper padding={padding} settings={settings}>
      <BackgroundGrid />
      <Gutter className="grid">
        <div className="cols-16 cols-m-8">
          {heading ? <h3 className={classes.heading}>{heading}</h3> : null}
          {description ? <p className={classes.description}>{description}</p> : null}
        </div>
        <div className={[classes.tableWrap, 'cols-16 cols-m-8'].join(' ')}>
          <table className={classes.table}>
            <colgroup>
              <col className={classes.col} />
              <col className={classes.col} />
              <col className={classes.col} />
              <col className={classes.col} />
              <col className={classes.colStatus} />
            </colgroup>
            <thead>
              <tr>
                <th>Payload Version</th>
                <th>Release Date</th>
                <th>Critical Fixes Until</th>
                <th>Security Fixes Until</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows?.map(
                ({
                  id,
                  criticalFixesUntil,
                  payloadVersion,
                  releaseDate,
                  securityFixesUntil,
                  status,
                }) => (
                  <tr key={id}>
                    <td>{payloadVersion}</td>
                    <td>{releaseDate || '-'}</td>
                    <td>{criticalFixesUntil || '-'}</td>
                    <td>{securityFixesUntil || '-'}</td>
                    <td>
                      <span
                        className={[classes.badge, status ? classes[status] : '']
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {status === 'eol'
                          ? 'EOL'
                          : status
                            ? status.charAt(0).toUpperCase() + status.slice(1)
                            : ''}
                      </span>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
