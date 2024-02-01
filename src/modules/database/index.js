const awilix = require('awilix')
const DatabaseService = require('./database-service')
const DatabaseController = require('./database-controller')
const HandyBeeAdapter = require('./adapters/handybee-adapter')
const HandyBeeFactory = require('./factories/handybee-factory')

class DatabaseModule {}

function registerModule (container) {
  container.register({
    databaseModule: awilix.asClass(DatabaseModule).singleton(),
    databaseController: awilix.asClass(DatabaseController).singleton(),
    databaseService: awilix.asClass(DatabaseService).singleton(),
    // HandyBee
    databaseFactory: awilix.asClass(HandyBeeFactory).singleton(),
    databaseAdapter: awilix.asClass(HandyBeeAdapter).singleton()
  })
}

module.exports = { registerDatabaseModule: registerModule }
