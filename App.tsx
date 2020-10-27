import React, { useState, useEffect, useCallback } from "react"
import Peer, { DataConnection } from "peerjs"
import "./App.css"

function App() {
  const [id, setId] = useState(``)
  const [peerId, setPeerId] = useState(``)
  const [message, setMessage] = useState(``)
  const [latestMessage, setLatestMessage] = useState(``)
  const [peer, setPeer] = useState<Peer | null>(null)
  const [conn, setConn] = useState<DataConnection | null>(null)
  const [connReady, setConnReady] = useState(false)
  const disconnect = useCallback(() => {
    conn?.close()
    setConn(null)
    setConnReady(false)
  }, [conn])
  const connect = useCallback(() => {
    if (!peer) throw new Error(`peer not initialized`)
    if (conn) throw new Error(`connection already setup`)
    const con = peer.connect(peerId)
    con.on("open", () => setConnReady(true))
    con.on("data", data => setLatestMessage(data))
    setConn(con)
  }, [peer, conn, peerId])
  const send = useCallback(() => {
    if (!conn) throw new Error(`connection not setup`)
    if (!connReady) throw new Error(`connection not ready`)
    conn.send(message)
    setLatestMessage(message)
  }, [conn, connReady, message])
  useEffect(() => {
    const p = new Peer()
    const checker = setInterval(() => {
      if (p.id) {
        clearInterval(checker)
        setPeer(p)
        setId(p.id)
      }
    }, 5)
    return () => clearInterval(checker)
  }, [])
  useEffect(() => {
    peer?.on("connection", conn => {
      conn.on("data", data => setLatestMessage(data))
      setConn(conn)
      setConnReady(true)
    })
  }, [peer])
  return (
    <div className="App">
      <div>
        <h3>My ID:</h3>
        <p>{id}</p>
      </div>
      <button onClick={disconnect}>disconnect</button>
      <form
        onSubmit={e => {
          e.preventDefault()
          connect()
        }}
      >
        <input
          type="text"
          placeholder="peer id"
          onChange={e => setPeerId(e.currentTarget.value)}
        />
        <button type="submit">connect</button>
      </form>
      <form
        onSubmit={e => {
          e.preventDefault()
          send()
        }}
      >
        <input
          type="text"
          placeholder="message"
          onChange={e => setMessage(e.currentTarget.value)}
        />
        <button disabled={!connReady} type="submit">
          send
        </button>
      </form>
      <div>
        <h5>message:</h5>
        <p>{latestMessage}</p>
      </div>
    </div>
  )
}

export default App
