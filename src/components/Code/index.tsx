'use client'

import CodeBlip from '@components/CodeBlip/index'
import { Highlight, Prism } from 'prism-react-renderer'
import React, { useCallback } from 'react'

import type { Props } from './types'

import classes from './index.module.scss'
import { theme } from './theme'

// Assignment must run before the `require` calls so the language components can
// attach themselves to the global Prism instance.
;(typeof global !== 'undefined' ? global : window).Prism = Prism
require('prismjs/components/prism-bash')
// css-extras must load before prism-scss so scss inherits its color/unit patterns.
require('prismjs/components/prism-css-extras')
require('prismjs/components/prism-scss')
require('prismjs/components/prism-docker')
require('prismjs/components/prism-http')

// The bundled TypeScript grammar deletes `literal-property` (so unquoted object
// keys go untokenized) but keeps `function-variable` (so a key whose value is a
// function gets aliased to `function`). The result is that `slug:` and `handler:`
// in the same object render with different token classes. Reverse that here.
const literalProperty = {
  'literal-property': {
    alias: 'property',
    lookbehind: true,
    pattern: new RegExp(
      '((?:^|[,{])[ \\t]*)(?!\\s)[_$a-zA-Z\\xA0-\\uFFFF](?:(?!\\s)[$\\w\\xA0-\\uFFFF])*(?=\\s*:)',
      'm',
    ),
  },
}
delete (Prism.languages.typescript as any)['function-variable']
delete (Prism.languages.tsx as any)['function-variable']
Prism.languages.insertBefore('typescript', 'operator', literalProperty)
Prism.languages.insertBefore('tsx', 'operator', literalProperty)

// prism-scss replaces css's `variable` pattern with one that only matches `$foo`,
// so CSS custom properties like `--theme-elevation-900` go untokenized. Broaden it.
;(Prism.languages.scss as any).variable = /\$[-\w]+|--[\w-]+/

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
    language,
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
      <Highlight code={children} language={language ?? 'tsx'} theme={theme}>
        {({ className: prismClassName, getLineProps, getTokenProps, style, tokens }) => (
          <div className={`${classNames} ${prismClassName}`} style={style}>
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
                          const { key, style: tokenStyle, ...rest } = getTokenProps({
                            key: index,
                            token,
                          })
                          // prism-react-renderer skips theme styles for plain tokens.
                          // Force-color them where the grammar leaves intended content
                          // un-tokenized: shell args (`payload jobs:run`) and YAML
                          // unquoted scalars (`node:24-alpine`, `mongo`, etc.).
                          const needsPlainColor =
                            (language === 'bash' ||
                              language === 'sh' ||
                              language === 'yaml' ||
                              language === 'yml') &&
                            token.types.length === 1 &&
                            token.types[0] === 'plain'
                          const finalStyle = needsPlainColor
                            ? { ...tokenStyle, color: '#79c0ff' }
                            : tokenStyle
                          return <span key={key as any} {...rest} style={finalStyle} />
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
