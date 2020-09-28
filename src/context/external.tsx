import { createContext } from 'react'

const External = createContext<{
  external: boolean
  toggleExternal: () => void
}>({
  external: false,
  toggleExternal: () => {},
})

export { External }
