const b4a = require('b4a')

module.exports = class DHTService {
  constructor ({ eventService, dhtRepository, dhtFactory, logger }) {
    this.eventService = eventService
    this.repository = dhtRepository
    this.factory = dhtFactory
    this.logger = logger
  }

  make (attributes) {
    return this.factory.make(attributes)
  }

  async create (attributes) {
    return await this.repository.create(attributes)
  }

  async index () {
    const nodes = await this.repository.getAll()

    return nodes.map(attributes => this.make(attributes))
  }

  async getDefaultNode () {
    return this.repository.getDefaultNode()
  }

  async getDefaultDhtKey (opts = {}) {
    const { force } = opts
    if (!force) return this.repository.getDefaultDhtKey()

    // Check if the user has a default DHT already
    const defaultNode = await this.getDefaultNode()
    if (defaultNode) return defaultNode.details.resourceKey

    // Create DHT node for the user and set it as "Default"
    const newNode = await this.create({ name: this.factory.randomName(), setAsDefault: true })

    return newNode.details.resourceKey
  }

  async disconnect (dhtModel) {
    if (dhtModel.socket) {
      await dhtModel.socket.destroy({ force: true })
    }
  }

  async findByResourceKey (key) {
    return await this.repository.findByResourceKey(key)
  }

  async initByKey (key) {
    const resource = await this.findByResourceKey(key)

    return this.factory.init(resource.details, resource.details.opts)
  }

  async connect ({ localPeerAddress, remotePeerAddress }) {
    // Find user's DHT node and initialize it
    const node = await this.initByKey(
      localPeerAddress = localPeerAddress || await this.getDefaultDhtKey({ force: true })
    )

    // Connect to the given remote peer address
    const remoteBuffer = typeof remotePeerAddress === 'string' ? b4a.from(remotePeerAddress, 'hex') : remotePeerAddress
    node.socket = node.dht.connect(remoteBuffer)
    node.socket.on('close', () => this._dhtOnClose({ node }))
    node.socket.on('error', (error) => this._dhtOnError({ node, error }))
    node.socket.on('connect', () => this._dhtOnConnection({ node }))

    return node
  }

  _dhtOnError ({ node, error }) {
    this.logger.error(`DHT ${node.key} on error`, error)
    this.eventService.emit('dht:error', { node, error })
  }

  _dhtOnClose ({ node }) {
    this.logger.info(`DHT connection closed: ${node.key}`)
    node.disconnected()
    this.eventService.emit('dht:closed', { node })
  }

  _dhtOnConnection ({ node }) {
    node.connected()
    this.eventService.emit('dht:connected', { node })
  }
}
