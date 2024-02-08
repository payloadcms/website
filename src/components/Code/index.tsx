/* eslint-disable no-param-reassign */
import React, { useCallback, useState } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'

import { RichText } from '@components/RichText'
import { CodeFeature, Props } from './types'

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

const CodeFeature: React.FC<{ feature: CodeFeature }> = ({ feature }) => {
  const [active, setActive] = useState(false)

  return (
    <>
      <button onClick={() => setActive(!active)} className={classes.codeFeatureButton}>
        <span className="visually-hidden">Code feature</span>
        <span></span>
      </button>
      <div className={classes.codeFeature}>
        <div className={[classes.content, active && classes.active].filter(Boolean).join(' ')}>
          <RichText content={feature.feature} />
        </div>
      </div>
    </>
  )
}

const Code: React.FC<Props> = props => {
  const { children, className, codeFeatures } = props
  const classNames = [classes.code, className && className].filter(Boolean).join(' ')

  const getCodeFeature = useCallback(
    (rowNumber: number) => {
      if (!codeFeatures) return null
      return codeFeatures.find(feature => feature.row === rowNumber) ?? null
    },
    [codeFeatures],
  )

  return (
    <Highlight {...defaultProps} theme={undefined} code={children} language="jsx">
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <div className={classNames} style={style}>
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line, key: i, className: classes.line })
            const shouldExclude = highlightLine(line, lineProps)
            const rowNumber = i + 1
            const codeFeature = getCodeFeature(rowNumber)
            return !shouldExclude ? (
              <div {...lineProps} key={i}>
                <span className={classes.lineNumber}>{rowNumber}</span>
                <div className={classes.lineCodeWrapper}>
                  {line.map((token, index) => {
                    const { key, ...rest } = getTokenProps({ token, key: index })
                    return <span key={key} {...rest} />
                  })}
                  {codeFeature ? <CodeFeature feature={codeFeature} /> : null}
                </div>
              </div>
            ) : null
          })}
        </div>
      )}
    </Highlight>
  )
}

export default Code
