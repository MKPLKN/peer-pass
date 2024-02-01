module.exports = class PasswordRepository {
  constructor ({ passwordFactory, databaseService }) {
    this.model = 'password'
    this.factory = passwordFactory
    this.databaseService = databaseService
  }

  async find (id) {
    const password = await this.databaseService.query({
      model: this.model,
      where: { id }
    })

    return this.factory.make(password)
  }

  async store (password) {
    await this.databaseService.store({
      model: this.model,
      attributes: password.getAttributes()
    })
  }
}
