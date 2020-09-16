//index.js
const app = getApp();

Page({
  data: {
    loading: true,
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
        item_id: true,
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
    this.setData({
      theme,
      loading: false,
    });
  },
  onBannerChange(e) {
    this.setData({
      currentBanner: e.detail.current,
    });
  },
  goToItem(e) {
    console.log(e);
    wx.navigateTo({
      url: `/pages/item/item?id=${e.currentTarget.dataset.id}`,
    });
  },
});
