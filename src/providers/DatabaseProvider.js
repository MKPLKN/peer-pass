import { createContext, useState, useContext, useEffect } from 'react'
import { databaseFacade, listenerManager } from 'peer-pass-backend'
import { useAuth } from './AuthProvider'

const DatabaseContext = createContext()

export function useDatabase () {
  return useContext(DatabaseContext)
}

export function DatabaseProvider ({ children }) {
  const { user } = useAuth()
  if (!user) return <>{children}</>

  const [loading, setLoading] = useState(true)
  const [database, setDatabase] = useState({
    key: '',
    discoveryKey: '',
    replicationState: {
      replicated: false,
      replication_status: null,
      replication_started_at: null,
      replication_stopped_at: null
    },
    swarm: {
      key: '',
      connections: []
    }
  })

  const replication = {
    getStatus: () => database?.replicationState?.replication_status,
    stopped: () => database?.replicationState?.replication_status === 'stopped',
    inProgress: () => database?.replicationState?.replication_status === 'in-progress',
    replicated: () => database?.replicationState?.replication_status === 'replicated',
    statusNull: () => database?.replicationState?.replication_status === null
  }

  const swarm = {
    hasKey: () => !!database?.swarm?.key,
    hasConnections: () => database?.swarm?.connections?.length > 0,
    connectionsCount: () => database?.swarm?.connections?.length,
    connections: () => database?.swarm?.connections
  }

  function joined () {
    //
  }

  function swarmUpdated (payload) {
    setDatabase((state) => ({ ...state, swarm: { key: payload.key, connections: payload.connections } }))
  }

  function swarmSetCallback (swarmKey) {
    if (!database || !database.discoveryKey) {
      return console.log('Database info missing:', database)
    }
    setDatabase((state) => ({ ...state, swarm: { ...state.swarm, key: swarmKey } }))
    listenerManager.add(`swarm:${swarmKey}:joined:${database.discoveryKey}.joined`, joined)
    listenerManager.add(`swarm:${swarmKey}:updated:${database.key}.swarmUpdated`, swarmUpdated)
  }

  function replicationStateUpdated (replicationState) {
    setDatabase((state) => ({ ...state, replicationState }))
  }

  useEffect(async () => {
    const getDatabase = async () => {
      setLoading(true)
      const { info } = await databaseFacade.getInfo({ name: '@password' })
      setDatabase((state) => ({ ...state, ...info }))
      setLoading(false)
    }
    await getDatabase()
  }, [])

  // Set listeners
  if (database && database.key) {
    listenerManager.add(`database:${database.key}:set:swarm.swarmSetCallback`, swarmSetCallback)
    listenerManager.add(`database:${database.key}:replicationState:updated.replicationStateUpdated`, replicationStateUpdated)
  }

  const databaseContextValue = { database, loading, replication, swarm }

  return <DatabaseContext.Provider value={databaseContextValue}>{children}</DatabaseContext.Provider>
}
