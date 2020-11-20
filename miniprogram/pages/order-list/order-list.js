const Request = require('../../API/request')
const { formatTime } = require('../../utils')

const model = new Request()
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['全部', '待付款', '待服务', '已取消'],
    currentStatus: 0,
    page: 1,
    limit: 100,
  },
  onLoad(options) {},
  onShow() {
    this.init()
  },
  async init() {
    wx.showLoading({
      title: '加载中...',
    })
    const result = await model.request({
      name: 'order',
      data: {
        status: this.data.currentStatus,
        page: this.data.page,
        limit: this.data.limit,
        action: 'fetch',
      },
    })
    this.setData({
      list: result.map((v) => {
        v.createTime = formatTime(v.createTime)
        console.log(v.orderTime)
        v.orderTime = formatTime(v.order_time)
        return v
      }),
    })
    wx.hideLoading()
  },

  onChange(e) {
    this.setData({
      currentStatus: e.detail,
    })
    this.init()
  },
})
