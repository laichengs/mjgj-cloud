// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const res = await cloud.cloudPay.unifiedOrder({
    body: event.body,
    outTradeNo: event.tradeNo,
    spbillCreateIp: '127.0.0.1',
    subMchId: '1294227001',
    totalFee: event.totalFee,
    envId: 'dev-testcloud',
    functionName: 'pay_cb',
  })
  return res
}