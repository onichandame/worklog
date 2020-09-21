import React, { useCallback, useEffect, useContext, FC, useState } from 'react'
import AvionDb from 'aviondb'
import { Button, Grid, TextField } from '@material-ui/core'

import { Ipfs } from '../context'

const addr = `test`
const col = `worklogs`

export const Workspace: FC = () => {
  const [log, setLog] = useState(``)
  const [list, setList] = useState<object[]>([])
  const [db, setDb] = useState<string>(``)
  const [updating, setUpdating] = useState(false)
  const { ipfs, ipfsErr } = useContext(Ipfs)
  const openDb = useCallback(async () => {
    if (ipfs && !ipfsErr) return AvionDb.init(addr, ipfs)
  }, [ipfs, ipfsErr])
  const updateList = async () => {
    setUpdating(true)
    const db = await openDb()
    const collection = await db?.initCollection(col)
    if (collection) {
      setList(await collection.find({}))
    }
    setUpdating(false)
  }
  const insertLog = async () => {
    try {
      console.log(`inserting`)
      const db = await openDb()
      console.log(`db opened`)
      const collection = await db?.initCollection(col)
      console.log(`collection opened`)
      if (collection) await collection.insertOne({ log } as any)
      console.log(`inserted`)
    } catch (e) {
      console.error(`insert failed`)
      console.error(e)
    }
  }
  useEffect(() => {
    const timer = setInterval(async () => {
      const db = await openDb()
      if (db) setDb(`${db.address.root}/${db.address.path}`)
    }, 1000)
    return () => clearInterval(timer)
  }, [openDb])
  return (
    <Grid container direction="column">
      <Grid item>{db}</Grid>
      <Grid item>
        {list.map(item => (
          <div>{JSON.stringify(item)}</div>
        ))}
      </Grid>
      <Grid item>
        <Button
          disabled={updating}
          onClick={() => updateList()}
          variant="contained"
        >
          update
        </Button>
      </Grid>
      <Grid item>
        <form
          onSubmit={e => {
            e.preventDefault()
            insertLog().then(() => updateList())
          }}
        >
          <TextField
            placeholder="new message"
            onChange={e => setLog(e.currentTarget.value)}
          />
          <Button variant="contained" type="submit">
            add
          </Button>
        </form>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={async () => {
              const db = await openDb()
              const collection = await db?.initCollection(col)
              if (collection) {
                await collection.drop()
              }
              await updateList()
            }}
          >
            clear
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
