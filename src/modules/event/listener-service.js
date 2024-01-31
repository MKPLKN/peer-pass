module.exports = class ListenerService {
  constructor () {
    this.listeners = new Map()
  }

  add (event, listener) {
    this.listeners.set(event, listener)
  }

  get (event) {
    return this.listeners.get(event)
  }

  delete (event) {
    return this.listeners.delete(event)
  }
}
