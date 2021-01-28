import { createContext, ComponentProps } from 'react'
import { IpfsProvider } from '@onichandame/react-ipfs-hook'

type Opts = ComponentProps<typeof IpfsProvider>['opts']

const IpfsOptions = createContext<{ opts: Opts; setOpts: (_: Opts) => void }>({
  opts: {},
  setOpts: () => {},
})

export { IpfsOptions }
