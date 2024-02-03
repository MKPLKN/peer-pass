module.exports = class DatabaseController {
  constructor ({ eventService, databaseService }) {
    this.eventService = eventService
    this.databaseService = databaseService
  }

  async index (event, payload) {
    try {
      if (!payload) payload = event

      const list = await this.databaseService.index()

      return { success: true, items: list }
    } catch (error) {
      return { success: false }
    }
  }

  async replicate (event = {}, payload) {
    try {
      if (!payload) payload = event
      const { swarmKey } = payload

      if (!this.databaseService.replicationSupported()) {
        throw new Error('Current database does not support replication')
      }

      if (this.databaseService.isReplicated() || this.databaseService.replicationInProgress()) {
        throw new Error('Current database is already replicated, or is waiting to be replicated')
      }

      this.databaseService.startReplication({ swarmKey })

      return { success: true }
    } catch (error) {
      console.log(error)
      return { success: false }
    }
  }
}
