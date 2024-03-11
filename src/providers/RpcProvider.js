import { createContext, useState, useContext, useEffect, useMemo } from 'react'
import { getFacade } from 'peer-pass-backend'
import { useAuth } from './AuthProvider'

const RpcContext = createContext()

export function useRpc () {
  return useContext(RpcContext)
}

export function RpcProvider ({ children }) {
  const { user } = useAuth()
  if (!user) return <>{children}</>
  const rpcFacade = getFacade('rpc')
  if (!rpcFacade) return <>{children}</>

  const [rpcModel, setRpcModel] = useState(null)

  useEffect(() => {
    async function init () {
      const { rpcModel: rpc } = await rpcFacade.init({ name: `${user.username}-rpc` })
      if (rpc) {
        setRpcModel(rpc)
      }
    }
    init()
  }, [])

  const rpcContextValue = useMemo(() => ({ rpcModel }), [rpcModel])

  return <RpcContext.Provider value={rpcContextValue}>{children}</RpcContext.Provider>
}
