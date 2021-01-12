import React, { FC, useState, useContext } from 'react'
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
  Badge,
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

import { PeerNum, Online } from '../context'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  appBar: { zIndex: theme.zIndex.drawer + 1 },
  drawer: { width: drawerWidth, flexShrink: 0 },
  drawerPaper: { width: drawerWidth },
  drawerContainer: { overflow: `auto` },
  menuButton: { marginRight: theme.spacing(2) },
}))

const Signal: FC = () => {
  const [, ipfsErr] = useIpfs()
  const peerNum = useContext(PeerNum)
  return (
    <Badge badgeContent={peerNum}>
      {ipfsErr ? (
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
      )}
    </Badge>
  )
}

export const NavBar: FC = () => {
  const styles = useStyles()
  const [ipfs, ipfsErr] = useIpfs()
  const online = useContext(Online)
  const [loading, setLoading] = useState(false)
  return (
    <div>
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
                <Switch
                  disabled={!!ipfsErr || loading}
                  value={online}
                  onChange={() => {
                    if (!ipfsErr && ipfs) {
                      if (online) {
                        ipfs.stop().finally(() => setLoading(false))
                        setLoading(true)
                      } else {
                        ipfs.start().finally(() => setLoading(false))
                        setLoading(true)
                      }
                    }
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  )
}
