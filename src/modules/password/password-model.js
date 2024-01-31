module.exports = class Password {
  constructor () {
    this.attributes = null
  }

  make (attributes) {
    this.attributes = attributes
    return this
  }

  getAttributes (key) {
    const attributes = this.attributes

    return key ? attributes[key] : attributes
  }
}
