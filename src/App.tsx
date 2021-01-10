import React, { FC, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useIpfs } from '@onichandame/react-ipfs-hook'

import { Layout, Workspace } from './components'
import { Online, Peers, PeerNum } from './context'

const App: FC = () => {
  const [ipfs, ipfsErr] = useIpfs()
  const [online, setOnline] = useState(false)
  const [peers, setPeers] = useState<any[]>([])
  const [peerNum, setPeerNum] = useState(0)
  useEffect(() => {
    const job = setInterval(() => {
      if (!ipfsErr && ipfs) {
        const statusNow = ipfs.isOnline()
        if (statusNow !== online) setOnline(statusNow)
      }
    })
    return () => clearInterval(job)
  }, [ipfs, ipfsErr, online])
  useEffect(() => {
    const job = setInterval(() => {
      if (ipfsErr) {
        if (peers.length !== 0) setPeers([])
      } else {
        if (ipfs) {
          ipfs.swarm.peers().then((prs: any[]) => {
            setPeers(prs)
          })
        }
      }
    })
    return () => clearInterval(job)
  }, [ipfs, ipfsErr, peers])
  useEffect(() => {
    const job = setInterval(() => {
      if (ipfsErr) {
        if (peerNum !== 0) setPeerNum(0)
      } else {
        const peerNumNow = peers.length
        if (peerNumNow !== peerNum) setPeerNum(peerNumNow)
      }
    })
    return () => clearInterval(job)
  }, [ipfsErr, peers, peerNum])
  return (
    <Online.Provider value={online}>
      <Peers.Provider value={peers}>
        <PeerNum.Provider value={peerNum}>
          <Layout>
            <Helmet title="Worklog" />
            <Workspace />
          </Layout>
        </PeerNum.Provider>
      </Peers.Provider>
    </Online.Provider>
  )
}

export default App
