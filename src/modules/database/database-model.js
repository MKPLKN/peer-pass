const b4a = require('b4a')

module.exports = class Database {
  constructor ({ db, listenerService }) {
    this.db = db
    this.listenerService = listenerService

    // Swarm model
    this.swarm = null

    // Noise stream
    this.socket = null

    // Replication stuff
    this.replicated = false
    this.replication_status = null
    this.replication_started_at = null
    this.replication_stopped_at = null
  }

  get topic () {
    return typeof this.discoveryKey === 'string' ? b4a.from(this.discoveryKey, 'hex') : this.discoveryKey
  }

  get discoveryKey () {
    return this.db.discoveryKey
  }

  get key () {
    return this.db.key.toString('hex')
  }

  isReplicated () {
    return this.swarm && this.replication_status === 'replicated'
  }

  replicationInProgress () {
    return this.swarm && this.replication_status === 'in-progress'
  }

  setSwarm (swarm) {
    this.swarm = swarm
  }

  setSocket (socket) {
    this.socket = socket
  }

  markAsReplicationInProgress () {
    this.socket = null
    this.replicated = false
    this.replication_status = 'in-progress'
    this.replication_started_at = null
    this.replication_stopped_at = null
  }

  markAsReplicated () {
    this.replicated = true
    this.replication_status = 'replicated'
    this.replication_started_at = new Date().getTime()
    this.replication_stopped_at = null
  }

  markAsReplicationStopped () {
    this.socket = null
    this.replicated = false
    this.replication_status = 'stopped'
    this.replication_started_at = null
    this.replication_stopped_at = new Date().getTime()
  }
}
