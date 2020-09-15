const OrderModel = require("../../API/order");
const { createSerialNo } = require("../../utils");

// miniprogram/pages/order/order.js
const model =     new OrderModel();
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    color: app.globalData.color,
    ipx: app.globalData.ipx,
    orderTime:"",
    currentId:"",
    isShow:false,
    img: '',
    title: '',
    price: 0,
    city: '',
    county: '',
    detail: '',
    name: '',
    phone: '',
    times:["09:00","11:00","13:00","16:00"],
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options.id);
    this.initDate();
  },
  async init(id) {
    const db = wx.cloud.database();
    const { data: item } = await db.collection('item').doc(id).get();
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
    let dates = [];
    for (let i = 0; i < 30; i++) {
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
          id:i+1
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
          id:i+1
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
      const dates = v.dates
      let week = []
      //判断第一个是否是0
      if(dates[0].week==0){
        week = this.cancel(dates)
      }else{
        let first = dates[0]
        let firstLen = 7-first.week;
        let firstWeek = dates.slice(0,firstLen)
        for(let f=first.week-1;f>=0;f--){
          firstWeek.unshift({
            year: firstWeek[0].year,
            month: firstWeek[0].month-1,
            date: "",
            week: f,
            status: 2,
          })
        }
        week.push(firstWeek)
        week.push(...this.cancel(dates.slice(firstLen)))
      }
      v.week = week;
      return v;
    });
    this.setData({ days,dates });
  },
  cancel(dates){
    let kk = [];
    let count = Math.ceil(dates.length/7)
    let remain = dates.length%7
    for(let c=0;c<count;c++){
      if(remain==0){
        kk.push(dates.slice(c*7,(c+1)*7))
      }else{
        if(c<count-1){
          kk.push(dates.slice(c*7,(c+1)*7))
        }else{
          let tmp = dates.slice(c*7,(c+1)*7)
          let last = tmp[tmp.length-1]
          for(let r=1;r<=7-remain;r++){
            tmp.push({
              year: last.year,
              month: last.month,
              date: "",
              week: last.week+r,
              status: 2,
            })
          }
          kk.push(tmp)
        }
      }
    }
    return kk;
  },
  onChooseDate(e){
    this.setData({
      currentId: e.currentTarget.dataset.id
    })
  },
  showTimeBox(){
    this.setData({
      isShow:true
    })
  },
  chooseTime(e){
    const date = this.data.dates.find(v=>v.id==this.data.currentId)
    const time= e.currentTarget.dataset.time;
    const month = date.month.toString().padStart(2,"0")
    this.setData({
      orderTime: `${date.year}-${month}-${date.date}(周${this.data.weeks[date.week]}) ${time}`,
      isShow:false
    })
  },
  close(){
    this.setData({
      currentId:"",
      isShow:false
    })
  },
  async submit(){
    if(this.data.orderTime==""){
      wx.showToast({
        title:"请选择时间",
        icon:"none"
      })
      return 
    }
    if(this.data.name==""){
      wx.showToast({
        title:"请选择地址",
        icon:"none"
      })
      return 
    }
   const serialNo =  createSerialNo();
    const params = {
      serial_no:serialNo,
      item_name:this.data.title,
      price:this.data.price,
      total: this.data.price,
      count:1,
      name: this.data.name,
      address: this.data.city+this.data.county+this.data.detail,
      order_time: new Date(this.data.orderTime.replace(/(\d{4})-(\d{2})-(\d{2}).{4}(\d{2}):(\d{2})/,"$1/$2/$3 $4:$5:00")),
      status:1,
      remark:"测试的"
    }
    const result = await model.createOrder(params)
    console.log(result)
  }
});
