module.exports = class PasswordService {
  constructor ({ passwordRepository, passwordFactory }) {
    this.repository = passwordRepository
    this.factory = passwordFactory
  }

  async create (attributes) {
    const password = this.factory.create(attributes)

    await this.repository.store(password)

    return password
  }
}
