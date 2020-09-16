// miniprogram/pages/my/my.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    itemClassify: [
      {
        url: 'image/group.png',
        title: '我的拼团',
      },
      {
        url: 'image/convent.png',
        title: '卡券兑换',
      },
      {
        url: 'image/address.png',
        title: '地址管理',
      },
      {
        url: 'image/concat.png',
        title: '联系客服',
      },
      {
        url: 'image/manage.png',
        title: '管理入口',
      },
    ],
    orders: [
      {
        id: 1,
        img: 'image/order@nopay.png',
        title: '代付款',
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
