
class StatusError extends Error {
  constructor(message, statusCode) {
    super();
    this.statusCode = statusCode;
  }
}

module.exports = {
  StatusError
}
