//index.js
const app = getApp();

Page({
  data: {
    banners: [],
    items: [],
    theme: [],
    currentBanner: 0,
  },

  async onLoad() {
    const db = wx.cloud.database();
    db.collection('banner')
      .field({
        img: true,
      })
      .get()
      .then((res) => {
        this.setData({
          banners: res.data,
        });
      });
    db.collection('item')
      .field({
        img: true,
        name: true,
      })
      .get()
      .then((res) => {
        this.setData({
          items: res.data,
        });
      });
    const { data: theme } = await db.collection('theme').get();
    console.log(theme)
    this.setData({
      theme,
    });
  },
  onBannerChange(e) {
    this.setData({
      currentBanner: e.detail.current,
    });
  },
});
