// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = cloud.database().command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch (event.action) {
    case 'fetch':
      return fetch(event)
    case 'create':
      return create(event)
    default:
      return cb(event, wxContext.OPENID)
  }
}

//查找订单
async function fetch(data) {
  const result = await db
    .collection('order')
    .aggregate()
    .match({
      status: data.status == 0 ? _.neq(data.status) : data.status,
    })
    .sort({
      createTime: -1,
    })
    .skip((data.page - 1) * data.limit)
    .limit(data.limit)
    .lookup({
      from: 'item',
      localField: 'item_id',
      foreignField: 'id',
      as: 'item',
    })
    .end()
  return result.list
}

//创建订单
async function create(data) {
  await db.collection('order').add({
    data,
  })
  return {
    serialNo: data.serial_no,
    amount: data.total,
    body: data.item_name,
    cb: 'order',
  }
}

//支付回调
async function cb(event, openid) {
  const {
    data: [order],
  } = await db
    .collection('order')
    .where({
      serial_no: event.outTradeNo,
    })
    .get()
  //1.更改订单状态
  await db
    .collection('order')
    .doc(order._id)
    .update({
      data: {
        status: 2,
      },
    })
  //2.发送订阅消息
  cloud.openapi.subscribeMessage.send({
    touser: openid,
    templateId: 'FPcVmx3r9wP3jhhCQnHNXR8GRH3O2wtZNelj-nqnXm0',
    page: "pages/order-list/order-list",
    data: {
      time1: {
        value: "2020/09/22",
      },
      amount8: {
        value: order.amount
      },
      thing3: {
        value: "微信支付"
      },
      thing2: {
        value: "皮沙发保养"
      }
    }
  })
  return {
    errcode: 0,
    errmsg: ''
  }
}