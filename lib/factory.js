/**
 * abstract class for create Classes based on app configuration
 */
const Logging = require('./logging');

class Factory {

  constructor() {
    this._classes = {}
  }
  register(name, createFunc) {
    this._classes[name] = createFunc
  }
  has(name) {
    return this._classes[name] !== undefined
  }
  unRegister(name) {
    delete this._classes[name]
  }
  create(name) {
    if (this._classes[name]) {
      return this._classes[name]();
    }
    Logging.logThrow(new Error(`factory: ${name} not found`))
  }
}

let factory = new Factory()
module.exports = factory;
