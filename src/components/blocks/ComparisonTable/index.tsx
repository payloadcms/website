import type { Page } from '@types'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper, type PaddingProps } from '@components/BlockWrapper/index'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'

import { TableIcon } from './Icons'
import classes from './index.module.scss'

type ComparisonTableProps = {
  hideBackground?: boolean
  padding?: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'comparisonTable' }>

export const ComparisonTable: React.FC<ComparisonTableProps> = (props) => {
  const { comparisonTableFields, padding } = props
  const { header, introContent, rows, settings, style } = comparisonTableFields || {}

  return (
    <BlockWrapper padding={padding} settings={settings}>
      <BackgroundGrid />
      <Gutter className="grid">
        <div className="cols-16 cols-m-8 grid">
          {introContent && (
            <div className={style === 'centered' ? 'cols-8 start-5 start-m-1' : 'cols-8'}>
              <RichText className={classes.richText} content={introContent} />
            </div>
          )}
        </div>
        <div className={[classes.tableWrap, 'cols-16 cols-m-8'].join(' ')}>
          <table className={classes.comparisonTable}>
            <colgroup>
              <col className={classes.featureColumn} />
              <col className={classes.column} />
              <col className={classes.column} />
            </colgroup>
            <thead>
              <tr>
                <th className={classes.featureColumnHeader}>{header?.tableTitle}</th>
                <th className={classes.columnHeader}>{header?.columnOneHeader}</th>
                <th className={classes.columnHeader}>{header?.columnTwoHeader}</th>
              </tr>
            </thead>
            <tbody>
              {rows?.map(
                ({ id, columnOne, columnOneCheck, columnTwo, columnTwoCheck, feature }) => (
                  <tr key={id}>
                    <td>{feature}</td>
                    <td>
                      <div className={classes.cell}>
                        <TableIcon checked={Boolean(columnOneCheck)} />
                        {columnOne}
                      </div>
                    </td>
                    <td>
                      <div className={classes.cell}>
                        <TableIcon checked={Boolean(columnTwoCheck)} />
                        {columnTwo}
                      </div>
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
