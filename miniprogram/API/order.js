const { CLOUD, DB, _ } = require('./request');
const Request = require('./request');

class OrderModel extends Request {
  async createOrder(data) {
    let { _id } = await DB.collection('order').add({
      data,
    });
    return {
      serialNo: data.serial_no,
      totalFee: data.total,
      body: data.item_name,
    };
  }
  async getOrders(data) {
    const { result } = await CLOUD.callFunction({
      name: 'order',
      data,
    });
    return result;
  }
}
module.exports = OrderModel;
