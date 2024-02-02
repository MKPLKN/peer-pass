const DatabaseAdapter = require('./database-adapter')

module.exports = class HandyBeeAdapter extends DatabaseAdapter {
  constructor ({ storage, eventService, replicationManager }) {
    super()
    this.storage = storage
    this.eventService = eventService
    this.replicationManager = replicationManager
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

  _parseQuery (query) {
    const { model, where } = query
    const result = []
    result.push(model)
    Object.keys(where).forEach(key => {
      result.push(key)
      result.push(where[key])
    })
    return result.join(':')
  }

  _parseStore (query) {
    const { model, attributes } = query
    const { id } = attributes
    return { key: `${model}:id:${id}`, value: attributes }
  }

  async query (query) {
    const key = this._parseQuery(query)
    return await this.get(key)
  }

  async store (query) {
    const { key, value } = this._parseStore(query)
    return await this.put(key, value)
  }

  async create (query) {
    return await this.store(query)
  }

  async put (key, value) {
    const db = this.getActiveDatabase()

    await db.put(key, JSON.stringify(value))
  }

  async get (key) {
    const db = this.getActiveDatabase()
    const value = (await db.getValue(key))
    if (!value) return null
    try {
      return JSON.parse(value.toString())
    } catch (error) {
      return value.toString()
    }
  }

  async getResources ({ resource }) {
    return (await this.getActiveMasterDatabase().getResources({ resource }))
  }

  async findResourceByResourceKey (key) {
    return await this.getActiveMasterDatabase().findResourceByResourceKey(key)
  }

  replicationSupported () {
    return this.replicationManager.replicationSupported()
  }

  isReplicated () {
    return this.replicationManager.isReplicated({
      databaseModel: this.getActiveDatabase({ model: true })
    })
  }

  replicationInProgress () {
    return this.replicationManager.replicationInProgress({
      databaseModel: this.getActiveDatabase({ model: true })
    })
  }

  startReplication (opts = {}) {
    const { swarmKey } = opts
    this.replicationManager.start({
      swarmKey, // Pre-defined hyperswarm
      databaseModel: this.getActiveDatabase({ model: true })
    })
  }
}
