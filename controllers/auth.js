const UserModel = require('../models/user');
const Bcrypt = require('bcrypt');
const Const = require('../lib/const')
const Config = require('config');
const Jwt = require('jsonwebtoken');
const Logging = require('../lib/logging');
const ApiReturn = require('../lib/api-return');

module.exports = {
  /**
   * the creation of a user
   * @param req
   * @param res
   * @param next
   */
  create: function(req, res, next) {
    res.json({status: Const.status.error, message: 'create user is not allowed', data: {}})
  },

  /**
   * return the authentication for the user
   *
   * @param req
   * @param res
   * @param next
   * @returns {Promise<*>}
   */
  authenticate: function(req, res, next) {
    // validate the use of username of email
    let name = req.body.email || req.body.username;
    if (! name) {
      return ApiReturn.error(req, res, new Error('missing username'), 403)
    } else {

      return UserModel.findOne({email: name}).then((userInfo) => {
        try {
          if (!userInfo) {
            Logging.log('warn', `[controller.auth].authenticate user ${name} not found`)
            res.json({status: Const.status.error, message: "invalid email/password!", data: null});
          } else {
            //if(bcrypt.compareSync(req.body.password, userInfo.password)) {
            if (userInfo.password === req.body.password) {
              UserModel.checkRefreshToken(userInfo)
              const token = Jwt.sign({id: userInfo.id}, Config.get('Server.secretKey'), {expiresIn: '1h'});
              const refreshToken = Jwt.sign({id: userInfo.id, refreshId: userInfo.refreshId}, Config.get('Server.secretKey'), {expiresIn: '100d'});
              ApiReturn.result(req, res, {
                // see: https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties
                user: (({name, email}) => ({name, email}))(userInfo),
                // user: userInfo,
                token,
                refreshToken,
              }, 'user login')
            } else {
              ApiReturn.error(req, res, new Error('invalid email/password'), 200)
            }
          }
        } catch (e) {
          ApiReturn.error(req, res, `[controller.auth].authenticate unexpected error: ${e.message}`)
        }
      })
    }
  },

  async refresh(req, res) {
    let token = req.body.token;
    if (!token || token.length < 10) {
      return ApiReturn.error(req, res, new Error(Const.results.noToken), 401 )
    } else {
      try {
        let decoded = Jwt.verify(
          token,
          Config.get('Server.secretKey'));
        // decoded: id, refreshId
        let userInfo = await UserModel.findById(decoded.id)
        if ((userInfo.refreshId === decoded.refreshId)) {
          ApiReturn.result(req, res, {
            // see: https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties
            user: (({name, email}) => ({name, email}))(userInfo),
            // user: userInfo,
            token: Jwt.sign({id: userInfo.id}, Config.get('Server.secretKey'), {expiresIn: '1h'}),
          }, 'user restored');
        } else {
          ApiReturn.error(req, res, new Error(Const.results.tokenExpired), 401)
        }
      } catch (e) {
        ApiReturn.error(req, res, e, 401)
      }
    }
  },

  setupLogging(req) {
    if (!req.session) {
      req.session = {}
    }
    req.session.log = function(level, message) {
      Logging.log(level, message)
    };
  },


  /**
   * validate the user against the encrypted key
   * @param req
   * @param res
   * @param next
   */
  async validate(req, res, next) {
    try {
      let token = req.headers && req.headers['authorization'] ? req.headers['authorization'] : ''
      try {
        if (token.length && token.substr(0, 'bearer'.length).toUpperCase() === 'BEARER') {
          token = token.substr('bearer'.length).trim()
        }
        let decoded = Jwt.verify(
          token,
          Config.get('Server.secretKey'));

        // req.body.user = await UserModel.findById(decoded.id);
        req.session = {
          user: await UserModel.findById(decoded.id)
        }
        this.setupLogging(req)
      //  res.json({status: Const.status.success, message: 'user logged in', data: null})
        next()
      } catch (err) {
        if (!token) {
          ApiReturn.error(req, res, Const.results.accessDenied, 403);
          // res.json({status: Const.status.error, message: Const.results.accessDenied, data: null})
        } else {
          ApiReturn.error(req, res, err.message)
          // res.json({status: Const.status.error, message: err.message, data: null})
        }
      }
    } catch(e) {
      ApiReturn.error(req, res, err)
      res.json({status: Const.status.error, message: `[authController.validate] ${r.message}`, data: null})
    }
  }
}
