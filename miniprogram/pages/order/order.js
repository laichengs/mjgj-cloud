// miniprogram/pages/order/order.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    color: app.globalData.color,
    ipx: app.globalData.ipx,
    img: '',
    title: '',
    price: 0,
    city: '',
    county: '',
    detail: '',
    name: '',
    phone: '',
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.init(options.id);
    this.initDate();
  },
  async init(id) {
    const db = wx.cloud.database();
    const { data: item } = await db.collection('item').doc(id).get();
    console.log(item);
    this.setData({
      img: item.main_img,
      title: item.name,
      price: item.price,
    });
  },
  chooseAddress() {
    wx.chooseAddress({
      success: (result) => {
        console.log(result);
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
  initDate() {
    const time = new Date();
    let year = time.getFullYear();
    let month = time.getMonth();
    let date = time.getDate();
    let day = time.getDay();
    let first = time.getDate() - day;
    let dates = [];
    for (let i = 0; i < 22; i++) {
      let d = new Date(year, month, date + i).getDate();
      let w = new Date(year, month, date + i).getDay();
      //第一个非周日
      if (i == 0 && w != 0) {
        for (let j = w; j > 0; j--) {
          //是否是本月的过期时间
          let kd = '';
          let km = '';
          if (d > new Date(year, month, date - (w - j + 1)).getDate()) {
            km = month + 1;
            kd = new Date(year, month, date - (w - j + 1)).getDate();
          }
          dates.unshift({
            year: year,
            month: km,
            date: kd,
            week: j - 1,
            status: 0,
          });
        }
      }
      //在本月
      if (d >= date) {
        dates.push({
          year: year,
          month: month + 1,
          date: d,
          week: w,
          status: 1,
        });
      }
      //代表已跨越
      if (d < date) {
        dates.push({
          year: month + 2 > 11 ? year + 1 : year,
          month: month + 2,
          date: d,
          week: w,
          status: 1,
        });
      }
    }
    let months = Array.from(new Set(dates.map((v) => v.month)));
    let days = [];
    months.forEach((item) => {
      days.push({
        year: dates.filter((v) => v.month == item)[0].year,
        month: item,
        dates: dates.filter((v) => v.month == item),
      });
    });
    days.map((v) => {
      let kk = [];
      // let count =
      //   v.dates[0].week != 0 && v.dates.length % 7 == 0
      //     ? Math.ceil(v.dates.length / 7) + 1
      //     : Math.ceil(v.dates.length / 7);
      let count = Math.ceil(v.dates.length / 7);
      let tmp = [];
      for (let i = 0; i < count; i++) {
        let td = v.dates.slice(i * 7, (i + 1) * 7);
        if (td.length < 7) {
          //往后补
          if (td[0].week == 0) {
            let len = td.length;
            for (let m = 1; m <= 7 - len; m++) {
              td.push({
                month: v.month,
                date: '',
                status: 2,
                week: td[len - 1].week + m,
              });
            }
          } else {
            let index = td.findIndex((v) => v.week == 6);
            kk = td.slice(index);
            td = td.slice(0, index);
            console.log(index);
            console.log(td.slice(0, index));
            for (let m = td[0].week - 1; m >= 0; m--) {
              td.unshift({
                month: v.month,
                date: '',
                status: 2,
                week: m,
              });
            }
            for (let k = 1; k <= 7 - kk.length; k++) {
              kk.push({
                month: v.month,
                date: '',
                status: 2,
                week: kk[kk.length - 1].week + k,
              });
            }
            console.log(td);
          }
        }
        tmp.push(td);
        tmp.push(kk);
      }
      v.week = tmp;
      return v;
    });
    console.log(days);
    this.setData({ days });
  },
});
