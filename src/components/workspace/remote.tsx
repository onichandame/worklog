import React, { FC, useState } from 'react'
import OrbitDb from 'orbit-db'
import { v1 as uuid } from 'uuid'
import { Grid, TextField, Button } from '@material-ui/core'
import DocStore from 'orbit-db-docstore'

import { Log } from './common'

type Props = {
  db: OrbitDb | null
}

export const Remote: FC<Props> = ({ db }) => {
  const [addr, setAddr] = useState(``)
  const [logs, setLogs] = useState<any[]>([])
  const [opening, setOpening] = useState(false)
  const [store, setStore] = useState<DocStore<Log> | null>(null)
  return (
    <Grid container direction="column">
      <Grid item>
        <form
          onSubmit={async e => {
            e.preventDefault()
            if (store) await store.close()
            try {
              setOpening(true)
              if (db && addr) {
                console.log(`opening remote store ${addr}`)
                const store = (await db.open(addr)) as DocStore<Log>
                console.log(store.replicationStatus)
                setStore(store)
                console.log(`store of type ${store.type} opened`)
                let logs = store.query(() => true)
                console.log(`logs ${JSON.stringify(logs)} found`)
                setLogs(logs)
                store.events.on('replicate', addr => {
                  console.log(`db ${addr} replicating`)
                })
                store.events.on('replicated', addr => {
                  console.log(`db ${addr} replicated`)
                  let logs = store.query(() => true)
                  console.log(`logs ${JSON.stringify(logs)} found`)
                  setLogs(logs)
                })
                store.events.on(`data`, () => console.log(`data`))
                store.events.on('load', addr => {
                  console.log(`db ${addr} loading`)
                })
                store.events.on('ready', addr => {
                  console.log(`db ${addr} ready`)
                })
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
