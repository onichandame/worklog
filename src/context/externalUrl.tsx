import { createContext } from 'react'

const ExternalUrl = createContext<{
  externalUrl: string
  setExternalUrl: (url: string) => void
}>({
  externalUrl: ``,
  setExternalUrl: () => {},
})

export { ExternalUrl }
