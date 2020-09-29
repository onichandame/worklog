import React, { useCallback, useEffect, useContext, FC, useState } from 'react'
import OrbitDb from 'orbit-db'
import { Button, Grid, TextField } from '@material-ui/core'
import { v1 as uuid } from 'uuid'
import EventStore from 'orbit-db-eventstore'

import { Ipfs } from '../../context'
import { Remote } from './remote'
import { Log, identifier } from './common'

const col = identifier

export const Workspace: FC = () => {
  const [log, setLog] = useState(``)
  const [list, setList] = useState<Log[]>([])
  const [db, setDb] = useState<OrbitDb | null>(null)
  const [collection, setCollection] = useState<EventStore<Log> | null>(null)
  const [colAddr, setColAddr] = useState<string>(``)
  const [updating, setUpdating] = useState(false)
  const { ipfs, ipfsErr } = useContext(Ipfs)
  const openDb = useCallback(async () => {
    console.log(`opening db`)
    if (ipfs && !ipfsErr) setDb(await OrbitDb.createInstance(ipfs))
    console.log(`opened db`)
  }, [ipfs, ipfsErr])
  const openCollection = useCallback(async () => {
    if (db) {
      console.log(`opening col`)
      const c = await db.log<Log>(col)
      await c.load()
      if (db) setCollection(c)
      console.log(`opened col`)
    }
  }, [db])
  const updateList = useCallback(async () => {
    try {
      setUpdating(true)
      if (collection) {
        console.log(`finding docs`)
        const items = collection
          .iterator()
          .collect()
          .map(e => e.payload.value)
        setList(items || [])
        console.log(`found docs`)
      }
    } finally {
      setUpdating(false)
    }
  }, [setUpdating, setList, collection])
  const updateColAddr = useCallback(() => {
    if (collection) {
      setColAddr(collection.address.toString())
      updateList()
    }
  }, [collection, updateList])
  const insertLog = useCallback(async () => {
    try {
      if (collection) {
        await collection.add({ _id: uuid(), log })
      }
      console.log(`inserted`)
    } catch (e) {
      console.error(`insert failed`)
      console.error(e)
    }
  }, [collection, log])
  const clearCollection = useCallback(async () => {
    if (collection) {
      await collection.drop()
      await openCollection()
    }
  }, [collection, openCollection])
  useEffect(() => {
    openDb()
  }, [openDb])
  useEffect(() => {
    openCollection()
  }, [openCollection])
  useEffect(() => {
    updateColAddr()
  }, [updateColAddr])
  return (
    <Grid container direction="column">
      <Grid item>{colAddr}</Grid>
      <Grid item>
        {list.map(item => (
          <div key={uuid()}>{JSON.stringify(item)}</div>
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
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={() => {
            if (collection) collection.load().then(() => updateList())
          }}
        >
          reload
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
            onClick={() => clearCollection().then(() => updateList())}
          >
            clear
          </Button>
        </Grid>
        <Grid item>
          <Remote db={db} />
        </Grid>
      </Grid>
    </Grid>
  )
}
