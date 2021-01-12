import React, { FC, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useIpfs } from '@onichandame/react-ipfs-hook'
import { Toolbar } from '@material-ui/core'

import { NavBar, Workspace } from './components'
import { Online, Peers, PeerNum } from './context'

const App: FC = () => {
  const [ipfs, ipfsErr] = useIpfs()
  const [online, setOnline] = useState(false)
  const [peers, setPeers] = useState<any[]>([])
  const [peerNum, setPeerNum] = useState(0)
  useEffect(() => {
    const job = setInterval(() => {
      if (!ipfsErr && ipfs && ipfs.isOnline) {
        const statusNow = ipfs.isOnline()
        if (statusNow !== online) setOnline(statusNow)
      } else {
        setOnline(false)
      }
    })
    return () => clearInterval(job)
  }, [ipfs, ipfsErr, online])
  useEffect(() => {
    const job = setInterval(() => {
      if (online && ipfs && ipfs.swarm && ipfs.swarm.peers) {
        ipfs.swarm.peers().then((prs: any[]) => {
          setPeers(prs)
        })
      } else {
        if (peers.length !== 0) setPeers([])
      }
    })
    return () => clearInterval(job)
  }, [ipfs, online, peers])
  useEffect(() => {
    const job = setInterval(() => {
      const peerNumNow = peers.length
      if (peerNumNow !== peerNum) setPeerNum(peerNumNow)
    })
    return () => clearInterval(job)
  }, [ipfsErr, peers, peerNum])
  return (
    <Online.Provider value={online}>
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
    </Online.Provider>
  )
}

export default App
