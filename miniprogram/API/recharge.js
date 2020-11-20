const Request = require('./request')

class RechargeModel extends Request {
  async pay(data) {
    return await this.send('pay', data)
  }
}
module.exports = RechargeModel
