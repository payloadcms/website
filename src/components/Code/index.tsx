'use client'
/* eslint-disable no-param-reassign */
import React, { useCallback } from 'react'
import { Highlight } from 'prism-react-renderer'
import { theme } from './theme.js'

import CodeBlip from '@components/CodeBlip/index.js'
import { Props } from './types.js'

import classes from './index.module.scss'

let highlightStart = false
const highlightClassName = 'highlight-line'

const highlightLine = (lineArray: { content: string }[], lineProps: { className: string }) => {
  let shouldExclude = false

  lineArray.forEach(line => {
    const { content } = line
    const lineContent = content.replace(/\s/g, '')

    // Highlight lines with "// highlight-line"
    if (lineContent.includes('//highlight-line')) {
      lineProps.className = `${lineProps.className} ${highlightClassName}`
      line.content = content.replace('// highlight-line', '').replace('//highlight-line', '')
    }

    // Stop highlighting
    if (!!highlightStart && lineContent === '//highlight-end') {
      highlightStart = false
      shouldExclude = true
    }

    // Start highlighting after "//highlight-start"
    if (lineContent === '//highlight-start') {
      highlightStart = true
      shouldExclude = true
    }
  })

  // Highlight lines between //highlight-start & //highlight-end
  if (highlightStart) {
    lineProps.className = `${lineProps.className} ${highlightClassName}`
  }

  return shouldExclude
}

const Code: React.FC<Props> = props => {
  const {
    children,
    className,
    codeBlips,
    disableMinHeight,
    showLineNumbers = true,
    parentClassName,
  } = props
  const classNames = [classes.code, 'code-block', className && className].filter(Boolean).join(' ')

  const getCodeBlip = useCallback(
    (rowNumber: number) => {
      if (!codeBlips) return null
      return codeBlips.find(blip => blip.row === rowNumber) ?? null
    },
    [codeBlips],
  )

  let blipCounter = 0

  return (
    <div
      className={[
        classes.codeWrap,
        disableMinHeight && classes.disableMinHeight,
        parentClassName && parentClassName,
      ]
        .filter(Boolean)
        .join(' ')}
      data-theme={'dark'}
    >
      <Highlight theme={theme} code={children} language="jsx">
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <div className={classNames} style={style}>
            {tokens
              .map((line, i) => {
                const lineProps = getLineProps({ line, key: i, className: classes.line })
                const shouldExclude = highlightLine(line, lineProps)
                return {
                  line,
                  lineProps,
                  shouldExclude,
                }
              })
              .filter(({ shouldExclude }) => !shouldExclude)
              .map(({ line, lineProps }, i) => {
                const rowNumber = i + 1
                const codeBlip = getCodeBlip(rowNumber)
                if (codeBlip) blipCounter = blipCounter + 1
                return (
                  <div {...lineProps} key={i}>
                    <>
                      {showLineNumbers && <span className={classes.lineNumber}>{rowNumber}</span>}
                      <div className={classes.lineCodeWrapper}>
                        {line.map((token, index) => {
                          const { key, ...rest } = getTokenProps({ token, key: index })
                          return <span key={key as any} {...rest} />
                        })}
                        {codeBlip ? <CodeBlip.Button index={blipCounter} blip={codeBlip} /> : null}
                      </div>
                    </>
                  </div>
                )
              })}
          </div>
        )}
      </Highlight>
    </div>
  )
}

export default Code
