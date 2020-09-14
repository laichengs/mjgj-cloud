// miniprogram/pages/item/item.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.init(options.id)
  },

  async init(id){
   const db =  wx.cloud.database();
   const {data:result } = await db.collection("item").doc(id).get();
    wx.setNavigationBarTitle({
      title: result.name
    })
    let k = result.content
    let imgs = []
    // k.replace(/\https.*\)$/mg,function(match,pos,origin){
    //   img.push(match.substr(0,match.length-1))
    //   return "EEEE"
    // })
    // console.log(img)
    const pattern = /!\[(.*?)\]\((.*?)\)/mg;
    let match;
    while((match=pattern.exec(k))!==null){
      imgs.push(match[2])
    }
    this.setData({
      content:      result.content,
      imgs
    })
  //  console.log(result);
  }
})