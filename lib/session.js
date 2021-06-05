

const Factory = require('./factory')
class Session {
   /**
   * initilize a user session
   * @param userId
   * @return {Promise<{user: *}>}
   */
  async  init(userId = 0) {
    this.userId = userId
    let UserModel = Factory.create('user')
    this.user = await UserModel.findById(userId)
  }
}
module.exports = Session;
