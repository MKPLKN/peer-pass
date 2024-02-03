const ReplicationManager = require('./replication-manager')

module.exports = class SwarmReplication extends ReplicationManager {
  constructor ({ eventService, listenerManager, replicationState }) {
    super()
    this.eventService = eventService
    this.listenerManager = listenerManager
    this.replicationState = replicationState
    this.setupEventListeners()
  }

  replicationSupported () {
    return true
  }

  isReplicated ({ databaseModel }) {
    return databaseModel.replicated === true && databaseModel.replication_status === 'replicated'
  }

  replicationInProgress ({ databaseModel }) {
    return databaseModel.replication_status === 'in-progress'
  }

  setupEventListeners () {
    this.eventService.on('swarm:setup:failure', ({ databaseModel, swarm }) => {
      this.replicationState.reset(databaseModel)
    })

    this.eventService.on('swarm:setup:completed', ({ databaseModel, swarm }) => {
      if (!databaseModel || databaseModel.swarm) return
      this.replicationState.setSwarm(databaseModel, swarm)
      this.addSwarmListeners({ databaseModel, swarm })
      if (this.replicationInProgress({ databaseModel })) {
        this.start({ databaseModel })
      }
    })
  }

  start ({ swarmKey, databaseModel }) {
    try {
      this.replicationState.inProgress(databaseModel)

      if (!databaseModel.swarm) {
        return this.eventService.emit('swarm:setup', { swarmKey, databaseModel })
      }

      this.join(databaseModel)
    } catch (error) {
      this.replicationState.reset(databaseModel)
    }
  }

  async join (databaseModel) {
    const { topic, swarm } = databaseModel
    const discovery = swarm.hyperswarm.join(topic)
    await discovery.flushed()
    this.eventService.emit(`swarm:${swarm.key}:joined:${topic.toString('hex')}`, { databaseModel })
  }

  addSwarmListeners ({ databaseModel, swarm }) {
    try {
      const dbKey = databaseModel.key
      const key = swarm.getAttributes('key')
      this.listenerManager.add(`swarm:${key}:connection._handleReplication:${dbKey}`, this._handleReplication.bind(this, databaseModel))
      this.listenerManager.add(`swarm:${key}:connection._addSocketListeners:${dbKey}`, this._addSocketListeners.bind(this, databaseModel))
      this.listenerManager.add(`swarm:${key}:update._checkUpdatedSwarm:${dbKey}`, this._checkUpdatedSwarm.bind(this, databaseModel))
    } catch (error) {
      // @TODO: use logger module
    }
  }

  removeSwarmListeners ({ databaseModel, swarm }) {
    const dbKey = databaseModel.key
    const key = swarm.getAttributes('key')
    this.listenerManager.remove(`swarm:${key}:connection._handleReplication:${dbKey}`)
  }

  _removeSocketListeners ({ databaseModel, swarm, socket }) {
    const dbKey = databaseModel.key
    const key = swarm.getAttributes('key')
    const remotePubkey = socket.remotePublicKey.toString('hex')
    this.listenerManager.remove(`swarm:${key}:close:${remotePubkey}._socketOnClose:${dbKey}`)
    this.listenerManager.remove(`swarm:${key}:error:${remotePubkey}._socketOnError:${dbKey}`)
  }

  _addSocketListeners (databaseModel, { socket }) {
    const dbKey = databaseModel.key
    const key = databaseModel.swarm.getAttributes('key')
    const remotePubkey = socket.remotePublicKey.toString('hex')
    this.listenerManager.add(`swarm:${key}:close:${remotePubkey}._socketOnClose:${dbKey}`, this._socketOnClose.bind(this, databaseModel))
    this.listenerManager.add(`swarm:${key}:error:${remotePubkey}._socketOnError:${dbKey}`, this._socketOnError.bind(this, databaseModel))
  }

  _checkUpdatedSwarm (databaseModel, { swarm }) {
    //
  }

  _handleReplication (databaseModel, { socket }) {
    databaseModel.db.replicate(socket)
    this.replicationState.replicated(databaseModel)

    // @TODO: use logger module instead
    const remotePubkey = socket.remotePublicKey.toString('hex')
    console.log(`* New connection to replicate "${databaseModel.key}" from "${remotePubkey}"`)
  }

  _socketOnClose (databaseModel, { socket, swarm }) {
    this._removeSocketListeners({ databaseModel, swarm, socket })
  }

  _socketOnError (databaseModel, { error, socket, swarm }) {
    this._removeSocketListeners({ databaseModel, swarm, socket })
  }
}
