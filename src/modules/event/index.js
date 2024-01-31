const awilix = require('awilix')
const EventService = require('./event-service')
const ListenerService = require('./listener-service')

class listenerFactory {
  create () {
    return new ListenerService()
  }
}

function registerModule (container) {
  container.register({
    eventService: awilix.asClass(EventService).singleton(),
    listenerFactory: awilix.asClass(listenerFactory).singleton()
  })
}

module.exports = { registeEventModule: registerModule }
