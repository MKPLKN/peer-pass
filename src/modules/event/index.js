const awilix = require('awilix')
const EventService = require('./event-service')
const ListenerManager = require('./listener-manager')

class listenerFactory {
  create () {
    return new ListenerManager()
  }
}

function registerModule (container) {
  container.register({
    eventService: awilix.asClass(EventService).singleton(),
    listenerFactory: awilix.asClass(listenerFactory).singleton()
  })
}

module.exports = { registeEventModule: registerModule }
