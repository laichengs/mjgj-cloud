// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const res = cloud.cloudPay.unifiedOrder({
    body: event.body,
    outTradeNo: event.serialNo,
    spbillCreateIp: '127.0.0.1',
    subMchId: '1294227001',
    totalFee: 1,
    // totalFee: event.amount*100,
    envId: 'dev-testcloud',
    functionName: event.cb,
  })

  return res
}
