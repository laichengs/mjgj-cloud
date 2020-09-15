const { CLOUD, DB } = require('./request');
const Request = require('./request');

class OrderModel extends Request {
    async createOrder(data){
      let {_id} = await DB.collection("order").add({
        data
      })
      return _id;
    }
}
module.exports = OrderModel;
