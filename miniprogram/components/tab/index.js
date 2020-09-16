// component/tab/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: Array,
    height: {
      type: Number,
      value: 80,
    },
    width: {
      type: Number,
      value: 40,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0,
    contentHeight: 0,
  },
  attached() {
    //计算内容高度
    this._cancelate();
    console.log(app.globalData.screenWidth, app.globalData.height);
    this.setData({
      contentHeight: app.globalData.height - this.data.height,
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    changeTab(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
        currentIndex: index,
      });
      this._cancelate();
      this.triggerEvent('change', index);
    },
    _cancelate() {
      this.setData({
        left:
          (750 * (this.data.currentIndex + 1)) / this.data.tabs.length -
          750 / this.data.tabs.length / 2 -
          this.data.width / 2,
      });
    },
  },
});
