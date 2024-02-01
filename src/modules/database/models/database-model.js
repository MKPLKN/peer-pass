module.exports = class Database {
  constructor ({ db, listenerManager }) {
    this.db = db
    this.listenerManager = listenerManager
  }

  replicationSupported () {
    return false
  }

  isReplicated () {
    return false
  }

  replicationInProgress () {
    return false
  }
}
