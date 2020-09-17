const OrderModel = require('../../API/order');
const { formatTime } = require('../../utils');

// miniprogram/pages/order-list/order-list.js
const model = new OrderModel();
const app = getApp();
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
    this.init();
  },
  async init() {
    wx.showLoading({
      title: '加载中...',
    });
    const result = await model.getOrders({
      status: this.data.currentStatus,
      page: this.data.page,
      limit: this.data.limit,
    });
    this.setData({
      list: result.map((v) => {
        v.createTime = formatTime(v.createTime);
        console.log(v.orderTime);
        v.orderTime = formatTime(v.order_time);
        return v;
      }),
    });
    wx.hideLoading();
  },

  onChange(e) {
    this.setData({
      currentStatus: e.detail,
    });
    this.init();
  },
});
