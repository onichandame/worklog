import React, { FC, useState, ContextType } from 'react'
import { IpfsProvider } from '@onichandame/react-ipfs-hook'
import { CssBaseline } from '@material-ui/core'

import { IpfsOptions } from './context'

export const Wrapper: FC = ({ children }) => {
  const [opts, setOpts] = useState<ContextType<typeof IpfsOptions>['opts']>({
    host: `localhost`,
    protocol: `http`,
    port: 5001,
  })
  return (
    <IpfsProvider opts={opts} livelinessProbe={true} probeInterval={1000}>
      <IpfsOptions.Provider value={{ opts, setOpts }}>
        <CssBaseline />
        {children}
      </IpfsOptions.Provider>
    </IpfsProvider>
  )
}
