import { createContext } from 'react'
import AvionDb from 'aviondb'

const Db = createContext<{
  db: AvionDb | null
  setDb: (db: AvionDb) => void
  dbErr: Error | null
  setDbErr: (e: Error) => void
}>({
  db: null,
  setDb: () => {},
  dbErr: null,
  setDbErr: () => {},
})

export { Db }
