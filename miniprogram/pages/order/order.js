const Request = require('../../API/request')
const { createSerialNo, initDate } = require('../../utils')

// miniprogram/pages/order/order.js
const model = new Request()
const app = getApp()
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
    this.init(options.id)
    this.setData({
      ...initDate(30),
    })
  },
  async init(id) {
    const db = wx.cloud.database()
    const { data: item } = await db.collection('item').doc(id).get()
    this.setData({
      id,
      img: item.main_img,
      title: item.name,
      price: item.price,
    })
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
        })
      },
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  onChooseDate(e) {
    const date = this.data.dates.find((v) => v.id == e.currentTarget.dataset.id)
    this.setData({
      currentId: e.currentTarget.dataset.id,
      date: `${date.year}/${date.month}/${date.date}`,
    })
  },
  showTimeBox() {
    this.setData({
      isShow: true,
    })
  },
  chooseTime(e) {
    const time = e.currentTarget.dataset.time
    this.setData({
      orderTime: time,
      isShow: false,
    })
  },
  close() {
    this.setData({
      currentId: '',
      isShow: false,
    })
  },
  bindinput(e) {
    this.setData({
      remark: e.detail.value,
    })
  },
  async submit() {
    wx.showLoading({
      title: '订单支付中...',
    })
    if (this.data.orderTime == '') {
      wx.showToast({
        title: '请选择时间',
        icon: 'none',
      })
      return
    }
    if (this.data.name == '') {
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
      })
      return
    }
    const serialNo = createSerialNo()
    const params = {
      serial_no: serialNo,
      item_name: this.data.title,
      price: this.data.price,
      total: this.data.price,
      count: 1,
      name: this.data.name,
      address: this.data.city + this.data.county + this.data.detail,
      order_date: new Date(this.data.date),
      order_time:
        this.data.times.findIndex((v) => v == this.data.orderTime) + 1,
      item_id: this.data.id,
      createTime: new Date(),
      pay_type: 1,
      status: 1,
      remark: this.data.remark,
      action: 'create',
    }
    const result = await model.request({
      name: 'order',
      data: params,
      err: '订单创建失败',
    })
    console.log(result)
    const { payment } = await model.request({
      name: 'pay',
      data: result,
      err: '订单支付失败',
    })
    console.log(payment)
    //因同一商户无法接入多个小程序云开发支付，故模拟支付成功
    wx.requestPayment({
      ...payment,
      success(res) {
        wx.showModal({
          title: '温馨提示',
          content: '恭喜您支付预约成功',
          confirmText: '查看',
          cancelText: '去首页',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/order-list/order-list',
              })
            } else {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          },
        })
      },
      fail(err) {
        wx.showToast({
          title: '支付失败',
          icon: 'none',
        })
      },
    })
  },
})
