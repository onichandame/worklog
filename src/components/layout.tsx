import React, { FC, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Menu,
  SignalCellular0Bar,
  SignalCellular1Bar,
  SignalCellular2Bar,
  SignalCellular3Bar,
  SignalCellular4Bar,
  SignalCellularOff,
} from '@material-ui/icons'
import {
  ListItemSecondaryAction,
  ListItemIcon,
  ListItem,
  List,
  ListItemText,
  Drawer,
  IconButton,
  Switch,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { useIpfs } from '@onichandame/react-ipfs-hook'

import { PeerNum } from '../context'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: `flex`,
  },
  appBar: { zIndex: theme.zIndex.drawer + 1 },
  drawer: { width: drawerWidth, flexShrink: 0 },
  drawerPaper: { width: drawerWidth },
  drawerContainer: { overflow: `auto` },
  menuButton: { marginRight: theme.spacing(2) },
  main: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

const Signal: FC = () => {
  const [, ipfsErr] = useIpfs()
  const peerNum = useContext(PeerNum)
  return ipfsErr ? (
    <SignalCellularOff />
  ) : peerNum < 16 ? (
    <SignalCellular0Bar />
  ) : peerNum < 32 ? (
    <SignalCellular1Bar />
  ) : peerNum < 64 ? (
    <SignalCellular2Bar />
  ) : peerNum < 128 ? (
    <SignalCellular3Bar />
  ) : (
    <SignalCellular4Bar />
  )
}

export const Layout: FC = ({ children }) => {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <AppBar position="fixed" className={styles.appBar}>
        <Toolbar>
          <IconButton
            className={styles.menuButton}
            edge="start"
            color="inherit"
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap>
            Worklog
          </Typography>
          <div style={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>
      <Drawer
        className={styles.drawer}
        classes={{ paper: styles.drawerPaper }}
        variant="permanent"
      >
        <Toolbar />
        <div className={styles.drawerContainer}>
          <List>
            <ListItem>
              <ListItemIcon>
                <Signal />
              </ListItemIcon>
              <ListItemText primary="IPFS" />
              <ListItemSecondaryAction>
                <Switch />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={styles.main}>
        <Toolbar />
        {children}
      </main>
    </div>
  )
}
