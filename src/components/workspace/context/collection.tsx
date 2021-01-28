import { createContext } from 'react'
import DocStore from 'orbit-db-docstore'

import { Log } from '../common'

const Collection = createContext<{
  collection: DocStore<Log> | null
  setCollection: (val: EventStore<Log>) => void
}>({ collection: null, setCollection: () => {} })

export { Collection }
