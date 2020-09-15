//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      console.log('fss');
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'dev-testcloud',
        traceUser: true,
      });
    }
    this.globalData = {
      color: '#e03a51',
    };
    this._getSystemInfo();
  },
  _getSystemInfo() {
    var _this = this;
    wx.getSystemInfo({
      success(res) {
        _this.globalData.StatusBar = res.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        _this.globalData.Custom = custom;
        _this.globalData.CustomBar =
          custom.bottom + custom.top - res.statusBarHeight;
        let tem = res.model;
        _this.globalData.height = (res.windowHeight * 750) / res.windowWidth;
        _this.globalData.scale = 750 / res.windowWidth;
        if (tem.indexOf('iPhone X') > -1) {
          _this.globalData.ipx = true;
        } else {
        }
      },
    });
  },
});
