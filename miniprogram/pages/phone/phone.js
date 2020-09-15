const UserModel = require('../../API/user');

const model = new UserModel();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isAuth: false,
    load: false,
    isSend: false,
    times: 60,
    code: '',
    isShow: false,
    phone: '',
    isPhone: false,
    wx: true,
  },

  onLoad(options) {
    this.setData({
      url: options.url,
    });
    this.init();
  },
  async init() {
    const _openid = await model.getopenid();
    const info = await model.getUserByOpenid({ _openid });
    if (info.length > 0) {
      this.setData({
        isAuth: true,
      });
    }
  },

  async bindUserInfo(e) {
    const res = model.addUserInfo(e);
    if (res) {
      this.setData({
        isAuth: true,
      });
    }
  },
  async bindPhoneNumber(e) {
    const res = await model.bindPhone(e);
    if (res) {
      wx.setStorageSync('phone', res);
      wx.showToast({
        title: '登录成功',
        icon: 'none',
      });
      setTimeout(() => {
        wx.redirectTo({
          url: this.data.url,
        });
      }, 1000);
    }
  },
});
