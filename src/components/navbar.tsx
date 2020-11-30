import React, { FC, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Menu } from '@material-ui/icons'
import {
  IconButton,
  TextField,
  Switch,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core'

import { External, ExternalUrl, Ipfs } from '../context'

const useStyles = makeStyles(theme => ({
  menuButton: { marginRight: theme.spacing(2) },
}))

export const NavBar: FC = () => {
  const styles = useStyles()
  const { externalUrl, setExternalUrl } = useContext(ExternalUrl)
  const { external, toggleExternal } = useContext(External)
  const { ipfs, ipfsErr } = useContext(Ipfs)
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton className={styles.menuButton} edge="start" color="inherit">
          <Menu />
        </IconButton>
        <Typography variant="h6" noWrap>
          Worklog
        </Typography>
        <div style={{ flexGrow: 1 }} />
        <Typography variant="h6" noWrap>
          {external ? `External` : `Embedded`}
        </Typography>
        <Switch
          disabled={!ipfs && !ipfsErr}
          value={external}
          onChange={toggleExternal}
        />
        {external && (
          <TextField
            defaultValue={externalUrl}
            onBlur={e => setExternalUrl(e.currentTarget.value)}
          />
        )}
      </Toolbar>
    </AppBar>
  )
}
