const awilix = require('awilix')

/**
 * WIP
 */

class ILogger {
  error (msg, trace) { throw new Error('Not implemented') }
}

class ConsoleLogger extends ILogger {
  constructor () {
    super()
    this.cache = new Map()
  }

  info (msg, trace) {
    console.info(msg, trace || '')
  }

  error (msg, trace) {
    console.error(msg, trace || '')
  }
}

function registerLoggerModule (container, options = {}) {
  const { logger } = options

  let loggerImplementation = null
  switch (logger) {
    case 'console':
      loggerImplementation = ConsoleLogger
      break
    default:
      loggerImplementation = ConsoleLogger
      break
  }

  container.register({
    logger: awilix.asClass(loggerImplementation).singleton()
  })
}

module.exports = { registerLoggerModule }
