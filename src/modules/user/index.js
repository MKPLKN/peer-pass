const awilix = require('awilix')
const userAuthenticatedListener = require('./listeners/user-authenticated-listener')
const UserService = require('./user-service')
const UserRepository = require('./user-repository')
const UserFactory = require('./user-factory')
const UserController = require('./user-controller')

class UserModule {
  constructor ({ eventService, userService }) {
    this.eventService = eventService
    this.userService = userService
  }

  registerEventListeners () {
    this.eventService.on('user:authenticated', userAuthenticatedListener({
      userService: this.userService,
      eventService: this.eventService
    }))
  }
}

function registerModule (container) {
  container.register({
    userModule: awilix.asClass(UserModule).singleton(),
    userController: awilix.asClass(UserController).singleton(),
    userService: awilix.asClass(UserService).singleton(),
    userRepository: awilix.asClass(UserRepository).singleton(),
    userFactory: awilix.asClass(UserFactory).singleton()
  })
}

module.exports = { registerUserModule: registerModule }
