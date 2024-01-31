const { initMasterComponents, createCore, makeDatabase } = require('p2p-resources')
const Database = require('./database-model')

module.exports = class DatabaseFactory {
  constructor ({ listenerFactory }) {
    this.listenerFactory = listenerFactory
  }

  async create (attributes) {
    const { keyPair } = attributes
    const { masterDb: db } = await initMasterComponents({ keyPair })

    let peerPassDb = await db.findResourceByName('peer-pass')
    if (!peerPassDb) {
      peerPassDb = await this.createDatabase({ db, name: 'peer-pass' })
    }

    // We also need access to the master db
    // p2p-resources ^0.0.12 store DHT nodes/swarms into the master db
    return {
      db: new Database({ db: peerPassDb, listenerService: this.listenerFactory.create() }),
      masterDb: db
    }
  }

  async createDatabase ({ db, name }) {
    const { core } = await createCore(db, { name, encrypted: true })
    return await makeDatabase(core)
  }
}
