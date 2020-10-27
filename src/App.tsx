import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Helmet } from 'react-helmet'

import { NavBar, Workspace } from './components'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}))

const App: FC = () => {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <Helmet title="Worklog" />
      <NavBar />
      <Workspace />
    </div>
  )
}

export default App
