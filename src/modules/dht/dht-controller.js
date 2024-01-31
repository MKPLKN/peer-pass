module.exports = class DHTController {
  constructor ({ dhtService, eventService }) {
    this.dhtService = dhtService
    this.eventService = eventService
  }

  async index (event, payload) {
    try {
      if (!payload) payload = event

      const list = await this.dhtService.index()

      return { success: true, items: list }
    } catch (error) {
      console.log(error)
      return { success: false }
    }
  }

  async create (event, payload) {
    try {
      if (!payload) payload = event

      const { details } = await this.dhtService.create(payload)

      return { success: true, details }
    } catch (error) {
      console.log(error)
      return { success: false }
    }
  }

  async connect (event, payload) {
    try {
      if (!payload) payload = event
      const { remotePeerAddress } = payload

      await this.dhtService.connect({ remotePeerAddress })

      return { success: true }
    } catch (error) {
      console.log(error)
      return { success: false }
    }
  }
}
