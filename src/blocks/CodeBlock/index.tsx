import React from 'react'

import Code from '@components/Code'
import { Gutter } from '@components/Gutter'
import { ReusableContent } from '@root/payload-types'

import classes from './index.module.scss'

type Props = Extract<ReusableContent['layout'][0], { blockType: 'code' }>

export const CodeBlock: React.FC<
  Props & { disableGutter?: boolean; disableMinHeight?: boolean }
> = ({ codeFields, disableGutter, disableMinHeight }) => {
  const {
    code,
    // language
  } = codeFields

  return (
    <>
      {disableGutter ? (
        <Code disableMinHeight>{`${code}`}</Code>
      ) : (
        <Gutter>
          <div className={'grid'}>
            <div
              className={[classes.codeBlock, 'cols-8 start-5 cols-m-6 start-m-2 cols-s-8 start-s-1']
                .filter(Boolean)
                .join(' ')}
            >
              <Code>{`${code}
          `}</Code>
            </div>
          </div>
        </Gutter>
      )}
    </>
  )
}
