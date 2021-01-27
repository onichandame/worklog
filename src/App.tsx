import React, { useCallback, ContextType, FC, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useIpfs } from '@onichandame/react-ipfs-hook'
import { Toolbar } from '@material-ui/core'

import { NavBar, Workspace } from './components'
import { Id, Status, Peers, PeerNum } from './context'

const App: FC = () => {
  const ipfsPromise = useIpfs()
  const [status, setStatus] = useState<ContextType<typeof Status>>(`UNKNOWN`)
  const [peers, setPeers] = useState<ContextType<typeof Peers>>([])
  const [id, setId] = useState(``)
  const [peerNum, setPeerNum] = useState(0)
  const checkStatus = useCallback(
    (err?: Error) => {
      ipfsPromise
        .then(ipfs => {
          if (!ipfs) {
            if (status !== `UNKNOWN`) setStatus(`UNKNOWN`)
          } else return ipfs.id()
        })
        .then(() => status !== `RUNNING` && setStatus(`RUNNING`))
        .catch((e: Error) => {
          status !== `ERROR` && setStatus(`ERROR`)
          throw err || e
        })
    },
    [ipfsPromise, status]
  )
  useEffect(checkStatus, [checkStatus])
  // update basic info every second
  useEffect(() => {
    const jobs: ReturnType<typeof setInterval>[] = []
    switch (status) {
      case `RUNNING`:
        ipfsPromise.then(ipfs => {
          ipfs && ipfs.id && ipfs.id().then(val => setId(val.id))
          ipfs &&
            ipfs.swarm &&
            ipfs.swarm.peers &&
            ipfs.swarm.peers().then((prs: any[]) => setPeers(prs))
        })
    }
    return () => jobs.forEach(job => clearInterval(job))
  }, [ipfsPromise, status, checkStatus])
  // update derived info
  useEffect(() => {
    const newPeerNum = peers.length
    if (newPeerNum !== peerNum) setPeerNum(newPeerNum)
  }, [peers, peerNum])
  return (
    <Id.Provider value={id}>
      <Status.Provider value={status}>
        <Peers.Provider value={peers}>
          <PeerNum.Provider value={peerNum}>
            <Helmet title="Worklog" />
            <div style={{ display: `flex` }}>
              <NavBar />
              <main style={{ flexGrow: 1 }}>
                <Toolbar />
                <Workspace />
              </main>
            </div>
          </PeerNum.Provider>
        </Peers.Provider>
      </Status.Provider>
    </Id.Provider>
  )
}

export default App
