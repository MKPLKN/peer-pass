const awilix = require('awilix')
const DatabaseService = require('./database-service')
const DatabaseFactory = require('./database-factory')
const DatabaseController = require('./database-controller')

class DatabaseModule {}

function registerModule (container) {
  container.register({
    databaseModule: awilix.asClass(DatabaseModule).singleton(),
    databaseController: awilix.asClass(DatabaseController).singleton(),
    databaseService: awilix.asClass(DatabaseService).singleton(),
    databaseFactory: awilix.asClass(DatabaseFactory).singleton()
  })
}

module.exports = { registerDatabaseModule: registerModule }
