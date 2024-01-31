const IStorage = require('./storage')

module.exports = class InMemoryStorage extends IStorage {
  constructor () {
    super()
    this.cache = new Map()
  }

  get (key) { return this.cache.get(key) }
  set (key, value) { this.cache.set(key, value) }
  delete (key) { this.cache.delete(key) }
  clear () { this.cache = new Map() }
}
