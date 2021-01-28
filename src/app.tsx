import React, { ContextType, FC, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useIpfs } from '@onichandame/react-ipfs-hook'
import { Toolbar } from '@material-ui/core'

import { NavBar, Workspace } from './components'
import { Id, Peers, PeerNum } from './context'

export const App: FC = () => {
  const { ipfs, error } = useIpfs()
  const [peers, setPeers] = useState<ContextType<typeof Peers>>([])
  const [id, setId] = useState(``)
  const [peerNum, setPeerNum] = useState(0)
  // update basic info every second
  useEffect(() => {
    if (!error && ipfs) {
      if (ipfs.id) ipfs.id().then(val => setId(val.id))
      else setId(``)
      if (ipfs.swarm && ipfs.swarm.peers)
        ipfs.swarm.peers().then((prs: any[]) => setPeers(prs))
      else setPeers([])
    } else {
      setId(``)
      setPeers([])
    }
  }, [ipfs, error])
  // update derived info
  useEffect(() => {
    const newPeerNum = peers.length
    if (newPeerNum !== peerNum) setPeerNum(newPeerNum)
  }, [peers, peerNum])
  return (
    <Id.Provider value={id}>
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
    </Id.Provider>
  )
}
