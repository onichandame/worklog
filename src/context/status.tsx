import { createContext } from 'react'

const Status = createContext(`UNKNOWN` as 'ERROR' | 'UNKNOWN' | 'RUNNING')

export { Status }
