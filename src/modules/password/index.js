const awilix = require('awilix')
const PasswordController = require('./password-controller')
const PasswordService = require('./password-service')
const PasswordRepository = require('./password-repository')
const PasswordFactory = require('./password-factory')

class PasswordModule {
  constructor ({ ipc, eventService, passwordService, passwordController }) {
    this.ipc = ipc
    this.eventService = eventService
    this.passwordService = passwordService
    this.controller = passwordController
  }

  registerEventListeners () {
    //
  }

  registerRoutes () {
    this.ipc.handle('password/create', this.controller.create)
  }
}

function registerModule (container) {
  container.register({
    passwordModule: awilix.asClass(PasswordModule).singleton(),
    passwordController: awilix.asClass(PasswordController).singleton(),
    passwordService: awilix.asClass(PasswordService).singleton(),
    passwordRepository: awilix.asClass(PasswordRepository).singleton(),
    passwordFactory: awilix.asClass(PasswordFactory).singleton()
  })
}

module.exports = { registerPasswordModule: registerModule }
