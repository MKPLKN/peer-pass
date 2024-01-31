const validate = require('./validation')

module.exports = class PasswordController {
  constructor ({ eventService, passwordService, logger }) {
    this.eventService = eventService
    this.passwordService = passwordService
    this.logger = logger
  }

  async create (event, payload) {
    try {
      if (!payload) payload = event

      const password = await this.passwordService.create(
        validate(payload)
      )

      return { success: true, password: password.getAttributes() }
    } catch (error) {
      console.log(error)
      this.logger.error(error.message, { username: payload.username })
      return { success: false, error }
    }
  }
}
