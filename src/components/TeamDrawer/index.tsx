import React, { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { useModal } from '@faceless-ui/modal'

import { Drawer, DrawerToggler } from '../Drawer'
import { TeamDrawerContent } from './DrawerContent'
import { TeamDrawerProps, TeamDrawerTogglerProps, UseTeamDrawer } from './types'

import classes from './index.module.scss'

const formatTeamDrawerSlug = ({
  uuid,
}: {
  uuid: string // supply when creating a new document and no id is available
}) => `team-drawer_${uuid}`

export const TeamDrawerToggler: React.FC<TeamDrawerTogglerProps> = ({
  children,
  className,
  drawerSlug,
  disabled,
  ...rest
}) => {
  return (
    <DrawerToggler
      slug={drawerSlug || ''}
      className={[className, `${classes}__toggler`].filter(Boolean).join(' ')}
      disabled={disabled}
      {...rest}
    >
      {children}
    </DrawerToggler>
  )
}

export const TeamDrawer: React.FC<TeamDrawerProps> = props => {
  const { drawerSlug } = props

  return (
    <Drawer slug={drawerSlug || ''} className={classes.teamDrawer} title="Create Team">
      <TeamDrawerContent {...props} />
    </Drawer>
  )
}

export const useTeamDrawer: UseTeamDrawer = ({ selectedTeam }) => {
  const uuid = useId()
  const { modalState, toggleModal, closeModal, openModal } = useModal()
  const [isOpen, setIsOpen] = useState(false)
  const drawerSlug = formatTeamDrawerSlug({
    uuid,
  })

  useEffect(() => {
    setIsOpen(Boolean(modalState[drawerSlug]?.isOpen))
  }, [modalState, drawerSlug])

  const toggleDrawer = useCallback(() => {
    toggleModal(drawerSlug)
  }, [toggleModal, drawerSlug])

  const closeDrawer = useCallback(() => {
    closeModal(drawerSlug)
  }, [drawerSlug, closeModal])

  const openDrawer = useCallback(() => {
    openModal(drawerSlug)
  }, [drawerSlug, openModal])

  const MemoizedDrawer = useMemo(() => {
    return props => (
      <TeamDrawer
        {...props}
        drawerSlug={drawerSlug}
        closeDrawer={closeDrawer}
        key={drawerSlug}
        selectedTeam={selectedTeam}
      />
    )
  }, [drawerSlug, closeDrawer, selectedTeam])

  const MemoizedDrawerToggler = useMemo(() => {
    return props => <TeamDrawerToggler {...props} drawerSlug={drawerSlug} />
  }, [drawerSlug])

  const MemoizedDrawerState = useMemo(
    () => ({
      drawerSlug,
      isDrawerOpen: isOpen,
      toggleDrawer,
      closeDrawer,
      openDrawer,
    }),
    [drawerSlug, isOpen, toggleDrawer, closeDrawer, openDrawer],
  )

  return [MemoizedDrawer, MemoizedDrawerToggler, MemoizedDrawerState]
}
