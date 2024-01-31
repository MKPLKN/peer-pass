module.exports = class DatabaseController {
  constructor ({ eventService, databaseService, swarmService }) {
    this.eventService = eventService
    this.databaseService = databaseService
    this.swarmService = swarmService
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

  async replicate (event, payload = {}) {
    try {
      if (!payload) payload = event
      const { swarmKey } = payload

      const db = this.databaseService.getActiveDatabase({ model: true })
      if (db.isReplicated() || db.replicationInProgress()) {
        throw new Error('Current database is already replicated, or is waiting to be replicated')
      }

      db.markAsReplicationInProgress()

      if (!db.swarm) {
        const swarm = await this.swarmService.setup({ swarmKey })
        db.setSwarm(swarm)
      }

      this.databaseService.replicate(db)

      return { success: true }
    } catch (error) {
      console.log(error)
      return { success: false }
    }
  }
}
