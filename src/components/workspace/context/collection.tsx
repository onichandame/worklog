import { createContext } from 'react'
import EventStore from 'orbit-db-eventstore'

import { Log } from '../common'

const Collection = createContext<{
  collection: EventStore<Log> | null
  setCollection: (val: EventStore<Log>) => void
}>({ collection: null, setCollection: () => {} })

export { Collection }
