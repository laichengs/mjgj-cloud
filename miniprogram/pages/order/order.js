const OrderModel = require('../../API/order');
const { createSerialNo, initDate } = require('../../utils');

// miniprogram/pages/order/order.js
const model = new OrderModel();
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    color: app.globalData.color,
    ipx: app.globalData.ipx,
    orderTime: '',
    currentId: '',
    remark: '',
    isShow: false,
    img: '',
    title: '',
    price: 0,
    city: '',
    county: '',
    detail: '',
    name: '',
    phone: '',
    times: ['09:00', '11:00', '13:00', '16:00'],
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options.id);
    this.setData({
      ...initDate(30),
    });
  },
  async init(id) {
    const db = wx.cloud.database();
    const { data: item } = await db.collection('item').doc(id).get();
    this.setData({
      id,
      img: item.main_img,
      title: item.name,
      price: item.price,
    });
  },
  chooseAddress() {
    wx.chooseAddress({
      success: (result) => {
        this.setData({
          city: result.cityName,
          county: result.countyName,
          detail: result.detailInfo,
          name: result.userName,
          phone: result.telNumber,
        });
      },
      fail: (res) => {},
      complete: (res) => {},
    });
  },
  onChooseDate(e) {
    this.setData({
      currentId: e.currentTarget.dataset.id,
    });
  },
  showTimeBox() {
    this.setData({
      isShow: true,
    });
  },
  chooseTime(e) {
    const date = this.data.dates.find((v) => v.id == this.data.currentId);
    const time = e.currentTarget.dataset.time;
    const month = date.month.toString().padStart(2, '0');
    this.setData({
      orderTime: `${date.year}-${month}-${date.date}(周${
        this.data.weeks[date.week]
      }) ${time}`,
      isShow: false,
    });
  },
  close() {
    this.setData({
      currentId: '',
      isShow: false,
    });
  },
  bindinput(e) {
    this.setData({
      remark: e.detail.value,
    });
  },
  async submit() {
    if (this.data.orderTime == '') {
      wx.showToast({
        title: '请选择时间',
        icon: 'none',
      });
      return;
    }
    if (this.data.name == '') {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
      });
      return;
    }
    const serialNo = createSerialNo();
    const params = {
      serial_no: serialNo,
      item_name: this.data.title,
      price: this.data.price,
      total: this.data.price,
      count: 1,
      name: this.data.name,
      address: this.data.city + this.data.county + this.data.detail,
      order_time: new Date(
        this.data.orderTime.replace(
          /(\d{4})-(\d{1,2})-(\d{1,2}).{5}(\d{2}):(\d{2})/,
          '$1/$2/$3 $4:$5:00'
        )
      ),
      item_id: this.data.id,
      createTime: new Date(),
      updateTime: new Date(),
      status: 1,
      remark: this.data.remark,
    };
    const result = await model.createOrder(params);
    //因同一商户无法接入多个小程序云开发支付，故模拟支付成功
    if (result) {
      wx.showModal({
        title: '温馨提示',
        content: '因云开发同一商户只支持一个小程序，故无法演示支付功能',
        confirmText: '查看',
        cancelText: '去首页',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/order-list/order-list',
            });
          } else {
            wx.switchTab({
              url: '/pages/index/index',
            });
          }
        },
      });
    }
  },
});
