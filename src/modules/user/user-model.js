module.exports = class User {
  constructor ({ username, keyPair, db, masterDb }) {
    this.username = username
    this.keyPair = keyPair
    this.database = db
    this.masterDb = masterDb

    // @TODO:
    // - Should we inject databaseService as a dependency instead of direct access to "db" and "masterDb"?
    // this.databaseService = databaseService
  }

  get name () {
    return this.username
  }

  get pubkey () {
    return this.keyPair && this.keyPair.publicKey ? this.keyPair.publicKey.toString('hex') : null
  }

  get db () {
    return this.database.db
  }
}
