


const Bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const Config = require('config')
const Const = require('../lib/const')
const Jsonfile = require('jsonfile');
const Helper = require('../lib/helper');
const { v4 : uuidv4} = require('uuid');
const Logging = require('../vendors/lib/logging')
const GUEST_ID = 1;

let USERS = [];
let UserFilename = false

module.exports = {

  info() {
    return {
      type: 'user.flex'
    }
  },

  /**
   *
   * @param user Object (email, password, etc)
   * @return {Promise<*>}
   * @throws Error not implemented
   */
  create: async function(user) {
    Logging.logThrow(Const.errors.notImplemented, 'user-flex.create');
  },

  /**
   * delete a user defined by the where
   * @param where
   * @returns {boolean}
   */
  delete(where) {
    Logging.logThrow(Const.errors.notImplemented, 'user-flex.delete');
  },

  /**
   * find one record
   *
   * @param what object holding the values of the found user
   * @returns {Promise<Object | false>}>}
   */
  findOne: async function(what) {
    Logging.logThrow(Const.errors.notImplemented, 'user-flex.findOne');
  },

  /**
   * find the user by the id
   * @param id
   * @returns {*|boolean}
   */
  async findById(id) {
    Logging.logThrow(Const.errors.notImplemented, 'user-flex.findById');
  },


  /**
   * set the internal refresh token that allows to reset the account for a user
   * @param user
   * @returns {Promise<boolean>}
   */
  async checkRefreshToken(user) {
    Logging.log('warn', Const.errors.notImplemented, 'user-flex.checkRefreshToken')
    return true;
  },

  async guest() {
    Logging.logThrow(Const.errors.userGuestIsMissing)
  }
}

