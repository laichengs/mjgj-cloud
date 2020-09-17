// miniprogram/pages/my/my.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    itemClassify: [
      {
        url: 'image/address.png',
        title: '地址管理',
        event: 'goToAddress',
      },
      {
        url: 'image/concat.png',
        title: '联系客服',
        event: 'goToAddress',
      },
      {
        url: 'image/manage.png',
        title: '管理入口',
        event: 'goToManage',
      },
    ],
    orders: [
      {
        id: 1,
        img: 'image/order@nopay.png',
        title: '待付款',
      },
      {
        id: 2,
        img: 'image/order@server.png',
        title: '已服务',
      },
      {
        id: 3,
        img: 'image/order@pay.png',
        title: '已付款',
      },
      {
        id: 4,
        img: 'image/order@cancel.png',
        title: '已取消',
      },
    ],
  },
  goToOrderLists(e) {
    app.globalData.status = e.currentTarget.dataset.status;
    wx.switchTab({
      url: `/pages/order-list/order-list?status`,
    });
  },
  goToManage() {
    wx.navigateToMiniProgram({
      appId: 'wx72599a6ae88a64d9',
    });
  },
  goToAddress() {
    wx.chooseAddress({});
  },
  goToShow() {
    wx.showToast({
      title: '演示数据',
      icon: 'none',
    });
  },
});
