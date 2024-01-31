module.exports = class DatabaseService {
  constructor ({ storage, eventService, databaseFactory }) {
    this.storage = storage
    this.eventService = eventService
    this.databaseFactory = databaseFactory
  }

  async make (attribtues) {
    return await this.databaseFactory.create(attribtues)
  }

  getActiveDatabase (opts = {}) {
    const { model } = opts
    const user = this.storage.get('user')
    return model ? user.database : user.db
  }

  getActiveMasterDatabase () {
    const user = this.storage.get('user')
    return user.masterDb
  }

  async getResources ({ resource }) {
    return (await this.getActiveMasterDatabase().getResources({ resource }))
  }

  async putJson (key, value) {
    await this.getActiveDatabase().putJson(key, value)
  }

  async getJsonValue (key) {
    return await this.getActiveDatabase().getJsonValue(key)
  }

  async findResourceByResourceKey (key) {
    return await this.getActiveMasterDatabase().findResourceByResourceKey(key)
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
      databaseModel.listenerService.add(eventName, listener)
    })
  }

  removeReplicationListeners (databaseModel) {
    const events = this.getReplicationEvents(databaseModel)
    Object.keys(events).forEach(eventName => {
      const listener = databaseModel.listenerService.get(eventName)
      this.eventService.off(eventName, listener)
      databaseModel.listenerService.delete(eventName)
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
