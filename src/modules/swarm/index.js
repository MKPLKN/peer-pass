const awilix = require('awilix')
const SwarmService = require('./swarm-service')
const SwarmController = require('./swarm-controller')
const SwarmFactory = require('./swarm-factory')
const SwarmRepository = require('./swarm-repository')

class SwarmModule {
  constructor ({ eventService, SwarmService }) {
    this.eventService = eventService
    this.swarmService = SwarmService
  }

  registerEventListeners () {
    //
  }
}

function registerModule (container) {
  container.register({
    swarmModule: awilix.asClass(SwarmModule).singleton(),
    swarmController: awilix.asClass(SwarmController).singleton(),
    swarmRepository: awilix.asClass(SwarmRepository).singleton(),
    swarmService: awilix.asClass(SwarmService).singleton(),
    swarmFactory: awilix.asClass(SwarmFactory).singleton()
  })
}

module.exports = { registerSwarmModule: registerModule }
