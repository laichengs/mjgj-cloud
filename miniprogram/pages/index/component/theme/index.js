// pages/index/component/theme/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    theme: Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    color: app.globalData.color,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToItem(e) {
      wx.navigateTo({
        url: `/pages/item/item?id=${e.currentTarget.dataset.id}`,
      })
    },
  },
})
