class Request {
  static CLOUD = wx.cloud
  static DB = wx.cloud.database()
  static _ = wx.cloud.database().command
  async getopenid() {
    const { result: openid } = await Request.CLOUD.callFunction({
      name: 'getopenid',
      data: {},
    })
    return openid
  }
  async request(params) {
    try {
      const { result } = await wx.cloud.callFunction({
        name: params.name,
        data: params.data,
      })
      return result
    } catch (e) {
      console.log(e)
      wx.showToast({
        icon: 'none',
        title: params.err || '请求错误',
      })
    }
  }
}
module.exports = Request
