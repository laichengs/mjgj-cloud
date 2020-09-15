const UserModel = require('../../API/user');

// miniprogram/pages/item/item.js
const app = getApp();
const model = new UserModel();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ipx: app.globalData.ipx,
    color: app.globalData.color,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options.id);
  },

  async init(id) {
    const db = wx.cloud.database();
    const { data: result } = await db.collection('item').doc(id).get();
    wx.setNavigationBarTitle({
      title: result.name,
    });
    let imgs = [];
    const pattern = /!\[(.*?)\]\((.*?)\)/gm;
    let match;
    while ((match = pattern.exec(result.content)) !== null) {
      imgs.push(match[2]);
    }
    this.setData({
      id: result._id,
      mainImg: result.main_img,
      price: result.price,
      name: result.name,
      unit: result.unit,
      imgs,
    });
  },
  async goToOrder() {
    let url = `/pages/order/order?id=${this.data.id}`;
    const phone = wx.getStorageSync('phone');
    if (phone) {
      wx.navigateTo({
        url,
      });
    } else {
      wx.navigateTo({
        url: `/pages/phone/phone?url=${url}`,
      });
    }
  },
});
