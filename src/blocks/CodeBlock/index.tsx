import React from 'react'

import Code from '@components/Code/index.js'
import CodeBlip from '@components/CodeBlip/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { ReusableContent } from '@root/payload-types.js'

import classes from './index.module.scss'

type Props = Extract<ReusableContent['layout'][0], { blockType: 'code' }>

export const CodeBlock: React.FC<
  Props & { disableGutter?: boolean; disableMinHeight?: boolean }
> = ({ codeFields, disableGutter, disableMinHeight }) => {
  const {
    code,
    codeBlips,
    // language
  } = codeFields

  return (
    <CodeBlip.Provider>
      <div className={classes.container}>
        <CodeBlip.Modal />
        {disableGutter ? (
          <Code codeBlips={codeBlips} disableMinHeight>{`${code}`}</Code>
        ) : (
          <Gutter>
            <div className={'grid'}>
              <div
                className={[
                  classes.codeBlock,
                  'cols-8 start-5 cols-m-6 start-m-2 cols-s-8 start-s-1',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Code codeBlips={codeBlips}>{`${code}
          `}</Code>
              </div>
            </div>
          </Gutter>
        )}
      </div>
    </CodeBlip.Provider>
  )
}
