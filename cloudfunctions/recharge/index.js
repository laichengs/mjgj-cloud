// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContent = cloud.getWXContext()
  console.log('充值函数', event)
  switch (event.action) {
    case 'create':
      return create(event, wxContent.OPENID)
    default:
      return cb(event)
  }
}

//创建订单
async function create(data, openid) {
  const { data: list } = await db
    .collection('user')
    .where({
      _openid: openid,
    })
    .get()
  await db.collection('recharge_record').add({
    data: {
      user: list[0]._id,
      serial_no: data.serialNo,
      recharge_type: data.rechargeType,
      time: data.time,
      amount: data.amount,
      status: 1,
    },
  })
  return {
    body: '会员充值',
    serialNo: data.serialNo,
    amount: data.amount,
    //支付回调函数
    cb: 'recharge',
  }
}

//支付订单回调
async function cb(event) {
  const {
    data: [record],
  } = await db
    .collection('recharge_record')
    .where({
      serial_no: event.outTradeNo,
    })
    .get()
  try {
    await db.runTransaction(async (transaction) => {
      //1.更新订单状态
      await transaction
        .collection('recharge_record')
        .doc(record._id)
        .update({
          data: {
            status: 2,
          },
        })
      //2.增加余额变动表
      await transaction.collection('balance_record').add({
        data: {
          type: 1,
          cause: 1,
          serial_no: event.outTradeNo,
          time: new Date(),
          user: record.user,
          amount: record.amount,
        },
      })
      //3.更改用户的会员级别以及余额
      const { data: card } = await transaction
        .collection('recharge_price')
        .doc(record.recharge_type)
        .get()
      await transaction
        .collection('user')
        .doc(record.user)
        .update({
          data: {
            balance: _.inc(record.amount),
            level: _.max(card.level),
          },
        })
    })
    return { errcode: 0, errmsg: '' }
  } catch (error) {
    return false
  }
}
