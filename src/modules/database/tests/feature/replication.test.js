const test = require('brittle')
const { removeUsers, beforeEach, freshUserSetup } = require('../../../../../tests/helpers.js')
const { createTestApplication } = require('../../../../boot.js')
const awilix = require('awilix')
const { FakeSwarmFactory, FakeSwarm, FakeDiscovery, FakeSocket } = require('../../../swarm/tests/fake-swarm-factory.js')

const username = 'test-user'
const password = 'password'

test('user can replicate its database', async (t) => {
  t.plan(17)

  class MyFakeSwarmFactory extends FakeSwarmFactory {
    initializeSwarm (opts) {
      const swarm = new FakeSwarm(opts)
      swarm.join = (topic) => {
        t.alike(topic, db.topic, 'Joined to correct topic')
        const key = db.swarm.getAttributes('key')
        databaseService.eventService.on(`swarm:${key}:joined:${db.topic.toString('hex')}`, ({ databaseModel }) => {
          t.alike(databaseModel.key, db.key, 'Database model is correct')
        })
        const dis = new FakeDiscovery()
        dis.flushed = () => {
          t.ok(true, 'Flushed')
        }
        return dis
      }
      return swarm
    }
  }

  const app = createTestApplication()
  app.override('swarmFactory', awilix.asClass(MyFakeSwarmFactory).singleton(), { asIs: true })
  app.setup()

  await beforeEach(app)
  await freshUserSetup({ app, username, password })
  const databaseService = app.container.resolve('databaseService')
  const db = databaseService.getActiveDatabase({ model: true })

  let _replicateCalled = 0
  const realReplicateFn = databaseService._replicate.bind(databaseService)
  databaseService._replicate = (databaseModel) => {
    _replicateCalled++
    return realReplicateFn(databaseModel)
  }

  let _replicateOnCloseCalled = 0
  const realReplicateOnCloseFn = databaseService._replicateOnClose.bind(databaseService)
  databaseService._replicateOnClose = (databaseModel) => {
    _replicateOnCloseCalled++
    return realReplicateOnCloseFn(databaseModel)
  }

  let _replicateOnErrorCalled = 0
  const realReplicateOnErrorFn = databaseService._replicateOnError.bind(databaseService)
  databaseService._replicateOnError = (databaseModel) => {
    _replicateOnErrorCalled++
    return realReplicateOnErrorFn(databaseModel)
  }

  t.absent(db.swarm, 'User database has not swarm instance before replication')
  t.alike(db.replication_status, null, 'DBs replication status is null before replication')
  const response = await app.container.resolve('databaseController').replicate()
  t.ok(response.success, 'DB replication response is success')

  // User has swarm set up
  t.ok(db.swarm, 'User database has swarm instance after replication')
  // Correct replication status
  t.alike(db.replication_status, 'in-progress', 'DBs replication status is set to "in-progress"')
  // All listeners are set up
  t.ok(db.listenerService.get(`swarm:${db.swarm.key}:connection`), 'Database has set listener for swarm connection event')
  t.ok(db.listenerService.get(`swarm:${db.swarm.key}:close`), 'Database has set listener for swarm close event')
  t.ok(db.listenerService.get(`swarm:${db.swarm.key}:error`), 'Database has set listener for swarm error event')
  t.alike(1, _replicateCalled, '_replicate event listener set only once')
  t.alike(1, _replicateOnCloseCalled, '_replicateOnClose event listener set only once')
  t.alike(1, _replicateOnErrorCalled, '_replicateOnError event listener set only once')

  // This is the Hyperbee's replicate function
  db.db.replicate = (s) => {
    t.alike(s.remotePublicKey.toString('hex'), socket.remotePublicKey.toString('hex'), 'Replication is called with correct socket')
  }

  // Fake swarm connection
  const socket = new FakeSocket()
  db.swarm.hyperswarm.emit('connection', socket)

  t.ok(db.socket, 'Socket is set to the Database model')
  t.alike(db.replication_status, 'replicated', 'DBs replication status is set to "replicated"')

  await removeUsers()
})
