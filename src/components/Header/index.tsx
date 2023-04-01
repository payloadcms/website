'use client'

import * as React from 'react'
import { useModal } from '@faceless-ui/modal'
import { useHeaderTheme } from '@providers/HeaderTheme'
import { ThemeProvider } from '@providers/Theme'
import { MainMenu } from '@root/payload-types'
import { useResize } from '@root/utilities/use-resize'
import { useScrollInfo } from '@faceless-ui/scroll-info'
import { MobileNav, modalSlug as mobileNavModalSlug, MobileNavClasses } from './MobileNav'
import { DesktopNav, DesktopNavClasses } from './DesktopNav'

import classes from './index.module.scss'

type OffscreenRendererProps = {
  children: React.ReactNode
  className?: string
}

export const OffscreenRenderer: React.FC<OffscreenRendererProps> = ({ children, className }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [desktopMinWidth, setDesktopMinWidth] = React.useState(0)
  const { size } = useResize(ref)

  React.useEffect(() => {
    if (ref.current?.offsetWidth && ref.current.offsetWidth > 0) {
      // console.log(ref.current?.offsetWidth, size)
      setDesktopMinWidth(ref?.current?.offsetWidth ?? 0)
    }
  }, [/* ref?.current?.offsetWidth, */ size?.width])

  return (
    <>
      <style>{`
        @media (max-width: ${desktopMinWidth}px) {
          .${DesktopNavClasses.desktopNav} {
            display: none;
            visibility: hidden;
          }
        }
        @media (max-width: ${desktopMinWidth}px) {
          .${MobileNavClasses.mobileNav} {
            display: block;
            visibility: visible;
          }
        }
      `}</style>
      <div
        ref={ref}
        aria-hidden="true"
        className={className}
        style={{
          position: 'fixed',
          top: '-9999px',
          width: 'fit-content',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
    </>
  )
}

export const Header: React.FC<MainMenu> = ({ navItems }) => {
  const { isModalOpen } = useModal()
  const isMobileNavOpen = isModalOpen(mobileNavModalSlug)
  const { headerColor } = useHeaderTheme()
  const { y } = useScrollInfo()
  const [hideBackground, setHideBackground] = React.useState(true)

  React.useEffect(() => {
    setHideBackground(y < 30)
  }, [y])

  return (
    <>
      <OffscreenRenderer className={classes.header}>
        <DesktopNav navItems={navItems} />
      </OffscreenRenderer>
      <ThemeProvider theme={headerColor}>
        <header
          className={[
            classes.header,
            hideBackground && classes.hideBackground,
            isMobileNavOpen && classes.mobileNavOpen,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <DesktopNav navItems={navItems} />
          <MobileNav navItems={navItems} />
        </header>
      </ThemeProvider>
    </>
  )
}
