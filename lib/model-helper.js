/**
 */

const Logging = require('./logging')

class ValidationError extends Error {
  constructor(props) {
    super(typeof props === 'string' ? props : props.message);
    if (typeof props !== 'object' || props.errors === undefined) {
      Logging.log('warn', 'missing validation errors');
      this.validationError = []
    } else {
      this.validationError = props.errors
    }
  }
}

module.exports = {
  ValidationError
}
