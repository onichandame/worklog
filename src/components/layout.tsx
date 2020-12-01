import React, { FC, useEffect } from 'react'
import { useIpfs } from 'react-ipfs-hook'
import { makeStyles } from '@material-ui/core/styles'
import {
  Menu,
  SignalCellular4Bar,
  SignalCellularConnectedNoInternet0Bar,
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

import { Ipfs } from '../context'

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

export const Layout: FC = ({ children }) => {
  const styles = useStyles()
  const [ipfs, ipfsErr] = useIpfs({ external: false, opts: {} })
  useEffect(() => {
    if (ipfsErr) console.error(ipfsErr)
  }, [ipfsErr])
  return (
    <Ipfs.Provider value={{ ipfs, ipfsErr }}>
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
                  {ipfs ? (
                    <SignalCellular4Bar />
                  ) : (
                    <SignalCellularConnectedNoInternet0Bar />
                  )}
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
    </Ipfs.Provider>
  )
}
