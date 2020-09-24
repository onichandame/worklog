import React, { useCallback, useEffect, useContext, FC, useState } from 'react'
import OrbitDb from 'orbit-db'
import DocumentStore from 'orbit-db-docstore'
import { Button, Grid, TextField } from '@material-ui/core'
import { v1 as uuid } from 'uuid'

import { Ipfs } from '../context'

declare module 'orbit-db-docstore' {
  export default interface DocumentStore<T> {
    put(doc: T): Promise<string>
  }
}

type Log = {
  _id: string
  log: string
}

const col = `worklogs`

export const Workspace: FC = () => {
  const [log, setLog] = useState(``)
  const [list, setList] = useState<Log[]>([])
  const [db, setDb] = useState<OrbitDb | null>(null)
  const [collection, setCollection] = useState<DocumentStore<Log> | null>(null)
  const [colAddr, setColAddr] = useState<string>(``)
  const [updating, setUpdating] = useState(false)
  const [remoteLogs, setRemoteLogs] = useState<any[]>([])
  const { ipfs, ipfsErr } = useContext(Ipfs)
  const openDb = useCallback(async () => {
    console.log(`opening db`)
    if (ipfs && !ipfsErr) setDb(await OrbitDb.createInstance(ipfs))
    console.log(`opened db`)
  }, [ipfs, ipfsErr])
  const openCollection = useCallback(async () => {
    if (db) {
      console.log(`opening col`)
      const c = await db.docs<Log>(col)
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
        setList(collection.query(() => true))
        console.log(`found docs`)
      }
    } finally {
      setUpdating(false)
    }
  }, [setUpdating, setList, collection])
  const updateColAddr = useCallback(() => {
    if (collection) {
      setColAddr(
        `/orbitdb/${collection.address.root}/${collection.address.path}`
      )
      updateList()
    }
  }, [collection, updateList])
  const insertLog = useCallback(async () => {
    try {
      console.log(`collection opened`)
      if (collection) await collection.put({ _id: uuid(), log })
      console.log(`inserted`)
    } catch (e) {
      console.error(`insert failed`)
      console.error(e)
    }
  }, [collection, log])
  const clearCollection = useCallback(async () => {
    if (collection) {
      await Promise.all(list.map(log => collection.del(log._id)))
    }
  }, [collection, list])
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
          {remoteLogs.map(log => (
            <div key={uuid()}>{log}</div>
          ))}
        </Grid>
        <Grid item>
          <Button
            type="button"
            variant="contained"
            onClick={async () => {
              if (db) {
                console.log(`opening remote store ${colAddr}`)
                const store = await db.open(colAddr)
                console.log(`store of type ${store.type} opened`)
                setRemoteLogs(store.all)
                console.log(`logs ${JSON.stringify(store.all)} found`)
              }
            }}
          >
            open from remote
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
