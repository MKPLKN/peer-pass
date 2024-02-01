const { createNode } = require('p2p-resources')

module.exports = class DHTRepository {
  constructor ({ databaseService }) {
    this.databaseService = databaseService
  }

  get defaultKey () {
    return 'peer-pass:default-dht'
  }

  async getAll () {
    const list = (await this.databaseService.getResources({ resource: 'hyperdht' })).map(node => ({ ...node.details }))

    return list
  }

  async getDefaultNode () {
    const defaultNodeKey = await this.databaseService.get(this.defaultKey)
    if (!defaultNodeKey) return null
    return await this.databaseService.findResourceByResourceKey(defaultNodeKey)
  }

  async create (attributes) {
    const { name, bootstrap, setAsDefault } = attributes

    const { details } = await createNode(this.databaseService.getActiveMasterDatabase(), { name, bootstrap: bootstrap || [] })
    if (details && details.resourceKey && setAsDefault) {
      await this.setDefaultDhtKey(details.resourceKey)
    }

    return { details }
  }

  async findByResourceKey (key) {
    return await this.databaseService.findResourceByResourceKey(key)
  }

  async setDefaultDhtKey (key) {
    await this.databaseService.put(this.defaultKey, key)
  }

  async getDefaultDhtKey () {
    return await this.databaseService.get(this.defaultKey)
  }
}
