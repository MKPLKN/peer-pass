const Password = require('./password-model')

const uuid = require('uuid')

module.exports = class PasswordFactory {
  make (attributes) {
    return (new Password()).make(attributes)
  }

  create (attributes) {
    const now = new Date().getTime()
    attributes.id = uuid.v4()
    attributes.updatedAt = now
    attributes.createdAt = now
    return (new Password()).make(attributes)
  }
}
