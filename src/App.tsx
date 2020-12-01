import React, { FC } from 'react'
import { Helmet } from 'react-helmet'

import { Layout /*, Workspace*/ } from './components'

const App: FC = () => {
  return (
    <Layout>
      <Helmet title="Worklog" />
      {
        //<Workspace />
      }
    </Layout>
  )
}

export default App
