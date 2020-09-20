import React, { useContext, FC, useState, useReducer } from 'react'
import AvionDb from 'aviondb'
import {
  Button,
  Grid,
  TextField,
  Switch,
  FormGroup,
  FormControlLabel,
} from '@material-ui/core'

import { Ipfs } from '../context'

const col = `worklogs`

export const Workspace: FC = () => {
  const [log, setLog] = useState(``)
  const [addr, setAddr] = useState<string>(``)
  const [remote, toggleRemote] = useReducer(old => !old, false)
  const [db, setDb] = useState<AvionDb | null>(null)
  const [dbErr, setDbErr] = useState<Error | null>(null)
  const [list, setList] = useState<object[]>([])
  const { ipfs, ipfsErr } = useContext(Ipfs)
  const closeDb = async () => db?.close()
  const openDb = async () => {
    if (ipfs && !ipfsErr) {
      try {
        if (remote) setDb(await AvionDb.open(addr, ipfs))
        else setDb(await AvionDb.init(addr, ipfs))
        setDbErr(null)
      } catch (e) {
        setDb(null)
        setDbErr(e)
      }
    }
  }
  const updateList = async () => {
    const collection = await db?.initCollection(col)
    if (collection) {
      setList(await collection.find({}))
    }
  }
  const insertLog = async () => {
    try {
      const collection = await db?.initCollection(col)
      if (collection) {
        await collection.insertOne({ log } as any)
      }
    } catch (e) {
      console.error(`insert failed`)
      console.error(e)
    }
  }
  return (
    <Grid container direction="column">
      <Grid item>
        <form
          onSubmit={e => {
            e.preventDefault()
            closeDb()
              .then(() => openDb())
              .then(() => updateList())
          }}
        >
          <FormGroup row>
            <TextField
              placeholder="db name/address"
              onChange={e => setAddr(e.currentTarget.value)}
            />
          </FormGroup>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch checked={remote} onChange={() => toggleRemote()} />
              }
              label="import from remote"
            />
          </FormGroup>
          <Button type="submit" variant="contained">
            open
          </Button>
        </form>
      </Grid>
      <Grid item>
        {dbErr
          ? dbErr.message
          : db
          ? `${db.address.root}/${db.address.path}`
          : `db not loaded`}
      </Grid>
      <Grid item>
        {list.map(item => (
          <div>{JSON.stringify(item)}</div>
        ))}
      </Grid>
      <Grid item>
        <Button onClick={() => updateList()} variant="contained">
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
          <TextField onChange={e => setLog(e.currentTarget.value)} />
          <Button variant="contained" type="submit">
            add
          </Button>
        </form>
      </Grid>
    </Grid>
  )
}
