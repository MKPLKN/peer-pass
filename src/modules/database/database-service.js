module.exports = class DatabaseService {
  constructor ({ eventService, databaseFactory, databaseAdapter }) {
    this.eventService = eventService
    this.factory = databaseFactory
    this.adapter = databaseAdapter
  }

  async create (attribtues) {
    return await this.factory.create(attribtues)
  }

  getActiveDatabase (opts = {}) {
    return this.adapter.getActiveDatabase(opts)
  }

  getActiveMasterDatabase () {
    return this.adapter.getActiveMasterDatabase()
  }

  async query (query) {
    return this.adapter.query(query)
  }

  async store (obj) {
    return this.adapter.store(obj)
  }

  async put (key, value) {
    await this.adapter.put(key, value)
  }

  async get (key) {
    return await this.adapter.get(key)
  }

  async getResources ({ resource }) {
    return this.adapter.getResources({ resource })
  }

  async findResourceByResourceKey (key) {
    return await this.adapter.findResourceByResourceKey(key)
  }

  getReplicationEvents (databaseModel) {
    const { swarm } = databaseModel
    const key = swarm.getAttributes('key')
    return {
      [`swarm:${key}:connection`]: this._replicate(databaseModel),
      [`swarm:${key}:close`]: this._replicateOnClose(databaseModel),
      [`swarm:${key}:error`]: this._replicateOnError(databaseModel)
    }
  }

  addReplicationListeners (databaseModel) {
    const events = this.getReplicationEvents(databaseModel)
    Object.keys(events).forEach(eventName => {
      const listener = events[eventName]
      this.eventService.on(eventName, listener)
      databaseModel.listenerManager.add(eventName, listener)
    })
  }

  removeReplicationListeners (databaseModel) {
    const events = this.getReplicationEvents(databaseModel)
    Object.keys(events).forEach(eventName => {
      const listener = databaseModel.listenerManager.get(eventName)
      this.eventService.off(eventName, listener)
      databaseModel.listenerManager.delete(eventName)
    })
  }

  replicate (databaseModel) {
    // Setup event listeners
    this.addReplicationListeners(databaseModel)
    // Expose the database
    this.expose(databaseModel)
  }

  async expose (databaseModel) {
    const topic = databaseModel.topic
    const swarm = databaseModel.swarm
    const key = swarm.getAttributes('key')
    if (!topic) throw new Error('Topic not found!')
    const discovery = swarm.hyperswarm.join(topic)
    await discovery.flushed()
    console.log(`Joined to ${topic.toString('hex')}`)
    this.eventService.emit(`swarm:${key}:joined:${topic.toString('hex')}`, { databaseModel })
  }

  _replicateOnClose ({ databaseModel }) {
    return () => {
      console.log('_replicateOnClose')
      databaseModel.markAsReplicationStopped()
    }
  }

  _replicateOnError ({ databaseModel }) {
    return ({ error }) => {
      console.log('_replicateOnError', error)
      databaseModel.markAsReplicationStopped()
    }
  }

  _replicate (databaseModel) {
    return ({ socket }) => {
      databaseModel.setSocket(socket)
      const { db } = databaseModel
      const remotePubkey = socket.remotePublicKey.toString('hex')

      // @TODO: use logger module instead
      console.log(`* New connection to replicate "${databaseModel.key}" from "${remotePubkey}"`)

      db.replicate(socket)
      databaseModel.markAsReplicated()

      // @TODO: uncomment if needed to keep the UI updated
      // this.eventService.emit('db:replicated', { databaseModel, socket })
      // db.core.once('append', () => {
      //   this.eventService.emit('db:replicated:append', { databaseModel, socket })
      // })
    }
  }
}
