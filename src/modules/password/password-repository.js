module.exports = class PasswordRepository {
  constructor ({ passwordFactory, databaseService }) {
    this.key = 'password'
    this.factory = passwordFactory
    this.databaseService = databaseService
  }

  getFullKey (id) {
    return `${this.key}:id:${id}`
  }

  async find (id) {
    const password = await this.databaseService.getJsonValue(this.getFullKey(id))
    return this.factory.make(password)
  }

  async store (password) {
    await this.databaseService.putJson(
      this.getFullKey(password.getAttributes('id')),
      password.getAttributes()
    )
  }
}
