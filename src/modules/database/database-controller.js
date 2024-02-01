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

      const dbModel = this.databaseService.getActiveDatabase({ model: true })

      if (!dbModel.replicationSupported()) {
        throw new Error('Current database does not support replication')
      }

      if (dbModel.isReplicated() || dbModel.replicationInProgress()) {
        throw new Error('Current database is already replicated, or is waiting to be replicated')
      }

      dbModel.markAsReplicationInProgress()

      if (!dbModel.swarm) {
        const swarm = await this.swarmService.setup({ swarmKey })
        dbModel.setSwarm(swarm)
      }

      this.databaseService.replicate(dbModel)

      return { success: true }
    } catch (error) {
      console.log(error)
      return { success: false }
    }
  }
}
