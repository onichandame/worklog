import React, { FC, useState, useReducer } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useIpfs } from 'react-ipfs-hook'

import { Ipfs, External, ExternalUrl } from './context'
import { NavBar, Workspace } from './components'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}))

const App: FC = () => {
  const styles = useStyles()
  const [externalUrl, setExternalUrl] = useState<string>(
    `http://localhost:5001`
  )
  const [external, toggleExternal] = useReducer(old => !old, true)
  const [ipfs, ipfsErr] = useIpfs({ external, opts: externalUrl })
  return (
    <ExternalUrl.Provider value={{ externalUrl, setExternalUrl }}>
      <External.Provider value={{ toggleExternal, external }}>
        <Ipfs.Provider value={{ ipfs, ipfsErr }}>
          <div className={styles.root}>
            <NavBar />
            {ipfsErr ? (
              ipfsErr.message
            ) : ipfs ? (
              <Workspace />
            ) : (
              `ipfs not loaded`
            )}
          </div>
        </Ipfs.Provider>
      </External.Provider>
    </ExternalUrl.Provider>
  )
}

export default App
