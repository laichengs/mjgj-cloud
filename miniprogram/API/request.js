class Request {
  static CLOUD = wx.cloud;
  static DB = wx.cloud.database();
  constructor() {
    // this.cloud = wx.cloud
  }
  async getopenid() {
    const { result: openid } = await Request.CLOUD.callFunction({
      name: 'getopenid',
      data: {},
    });
    return openid;
  }
}
module.exports = Request;
