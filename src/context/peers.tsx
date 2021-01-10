import { createContext } from 'react'

type Peer = {
  addr: any
  peer: string
  latency?: string
  muxer: string
  streams?: string[]
  direction: number
}
const Peers = createContext<Peer[]>([])

export { Peers }
