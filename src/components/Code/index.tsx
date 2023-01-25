/* eslint-disable no-param-reassign */
import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { Props } from './types'
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
  const { children, className } = props
  const classNames = [classes.code, className && className].filter(Boolean).join(' ')

  return (
    <Highlight {...defaultProps} theme={undefined} code={children} language="jsx">
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <div className={classNames} style={style}>
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line, key: i })
            const shouldExclude = highlightLine(line, lineProps)
            return !shouldExclude ? (
              <div {...lineProps} key={i}>
                {line.map((token, index) => {
                  const { key, ...rest } = getTokenProps({ token, key: index })
                  return <span key={key} {...rest} />
                })}
              </div>
            ) : null
          })}
        </div>
      )}
    </Highlight>
  )
}

export default Code
