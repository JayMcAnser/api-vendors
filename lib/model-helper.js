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

class StatusError extends Error {
  constructor(props) {
    super(typeof props === 'string' ? props : props.message);
    if (typeof props !== 'object' || props.status === undefined) {
      Logging.log('warn', 'missing status');
      this.status = 500
    } else {
      this.status = props.status
    }

  }
}

module.exports = {
  ValidationError,
  StatusError
}
