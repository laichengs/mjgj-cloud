const Request = require('../../API/request')
const { createSerialNo } = require('../../utils')

const model = new Request()
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    list: [],
    color: app.globalData.color,
  },

  onLoad: function (options) {
    this._load()
  },

  async _load() {
    const db = wx.cloud.database()
    const { data: list } = await db.collection('recharge_price').get()
    this.setData({
      list,
    })
  },
  bindPrice(e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index,
    })
  },

  async pay() {
    wx.showLoading({
      title: '正在支付中...',
    })
    const card = this.data.list[this.data.currentIndex]
    const result = await model.request({
      name: 'recharge',
      data: {
        serialNo: createSerialNo(),
        amount: card.amount,
        time: new Date(),
        rechargeType: card._id,
        action: 'create',
      },
      err: '新建订单失败',
    })
    const { payment } = await model.request({
      name: 'pay',
      data: result,
      err: '充值错误',
    })
    wx.requestPayment({
      ...payment,
      success(res) {
        wx.showToast({
          title: '支付成功',
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/my/my',
          })
        }, 1000)
      },
      fail(err) {
        wx.showToast({
          icon: 'none',
          title: '您取消了支付',
        })
      },
    })
  },
})
