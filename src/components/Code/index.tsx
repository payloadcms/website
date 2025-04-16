'use client'

import CodeBlip from '@components/CodeBlip/index'
import { Highlight } from 'prism-react-renderer'
import React, { useCallback } from 'react'

import type { Props } from './types'

import classes from './index.module.scss'
import { theme } from './theme'

let highlightStart = false
const highlightClassName = classes.highlight

const highlightLine = (lineArray: { content: string }[], lineProps: { className: string }) => {
  let shouldExclude = false

  lineArray.forEach((line) => {
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

const Code: React.FC<Props> = (props) => {
  const {
    children,
    className,
    codeBlips,
    disableMinHeight,
    parentClassName,
    showLineNumbers = true,
  } = props
  const classNames = [classes.code, 'code-block', className && className].filter(Boolean).join(' ')

  const getCodeBlip = useCallback(
    (rowNumber: number) => {
      if (!codeBlips) {
        return null
      }
      return codeBlips.find((blip) => blip.row === rowNumber) ?? null
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
        'code-block-wrap',
        'notranslate',
      ]
        .filter(Boolean)
        .join(' ')}
      data-theme={'dark'}
      translate="no"
    >
      <Highlight code={children} language="tsx" theme={theme}>
        {({ getLineProps, getTokenProps, style, tokens }) => (
          <div className={classNames} style={style}>
            {tokens
              .map((line, i) => {
                const lineProps = getLineProps({ className: classes.line, key: i, line })
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
                if (codeBlip) {
                  blipCounter = blipCounter + 1
                }
                return (
                  <div {...lineProps} key={i}>
                    <>
                      {showLineNumbers && <span className={classes.lineNumber}>{rowNumber}</span>}
                      <div className={classes.lineCodeWrapper}>
                        {line.map((token, index) => {
                          const { key, ...rest } = getTokenProps({ key: index, token })
                          return <span key={key as any} {...rest} />
                        })}
                        {codeBlip ? <CodeBlip.Button blip={codeBlip} index={blipCounter} /> : null}
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
