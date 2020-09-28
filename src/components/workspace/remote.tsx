import React, { FC, useState } from 'react'
import OrbitDb from 'orbit-db'
import { v1 as uuid } from 'uuid'
import { Grid, TextField, Button } from '@material-ui/core'

type Props = {
  db: OrbitDb | null
}

export const Remote: FC<Props> = ({ db }) => {
  const [addr, setAddr] = useState(``)
  const [logs, setLogs] = useState<any[]>([])
  const [opening, setOpening] = useState(false)
  return (
    <Grid container direction="column">
      <Grid item>
        <form
          onSubmit={async e => {
            e.preventDefault()
            try {
              setOpening(true)
              console.log(db)
              console.log(addr)
              if (db && addr) {
                console.log(`opening remote store ${addr}`)
                const store = await db.open(addr, { type: 'docstore' })
                console.log(`store of type ${store.type} opened`)
                setLogs(store.all)
                console.log(`logs ${JSON.stringify(store.all)} found`)
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
