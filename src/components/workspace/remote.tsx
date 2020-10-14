import React, { FC, useState } from 'react'
import OrbitDb from 'orbit-db'
import { v1 as uuid } from 'uuid'
import { Grid, TextField, Button } from '@material-ui/core'
import DocStore from 'orbit-db-docstore'

import { Log, identifier } from './common'

type Props = {
  db: OrbitDb | null
}

export const Remote: FC<Props> = ({ db }) => {
  const [addr, setAddr] = useState(``)
  const [logs, setLogs] = useState<any[]>([])
  const [opening, setOpening] = useState(false)
  const [store, setStore] = useState<EventStore<Log> | null>(null)
  return (
    <Grid container direction="column">
      <Grid item>
        <form
          onSubmit={async e => {
            e.preventDefault()
            if (store) await store.close()
            try {
              setOpening(true)
              console.log(db)
              console.log(addr)
              if (db && addr) {
                console.log(`opening remote store ${addr}`)
                const store = (await db.open(addr, {
                  type: 'eventlog',
                })) as EventStore<Log>
                setStore(store)
                console.log(`store of type ${store.type} opened`)
                console.log(
                  `logs ${JSON.stringify(store.get(identifier))} found`
                )
                store.events.on('replicated', addr => {
                  console.log(`db ${addr} replicated`)
                  console.log(
                    `logs ${JSON.stringify(store.get(identifier))} found`
                  )
                  const items = store
                    .iterator()
                    .collect()
                    .map(e => e.payload.value)
                  setLogs(items || [])
                })
                store.events.on('load', addr => {
                  console.log(`db ${addr} loading`)
                })
                store.events.on('ready', addr => {
                  console.log(`db ${addr} ready`)
                })
                store.events.on('replicate', addr => {
                  console.log(`db ${addr} replicating`)
                })
                const items = store
                  .iterator()
                  .collect()
                  .map(e => e.payload.value)
                setLogs(items || [])
              }
            } catch (e) {
              console.error(e)
            } finally {
              setOpening(false)
            }
          }}
        >
          <TextField
            placeholder="Orbit address"
            onChange={e => setAddr(e.currentTarget.value)}
          />
          <Button type="submit" variant="contained" disabled={opening}>
            open
          </Button>
        </form>
      </Grid>
      <Grid item>
        {logs.map(log => (
          <div key={uuid()}>{JSON.stringify(log)}</div>
        ))}
      </Grid>
    </Grid>
  )
}
