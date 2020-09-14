// pages/index/component/item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: Array,
  },
  observers: {
    list: function (newVal, oldVal) {
      this.setData({
        items: newVal,
      });
    },
  },
  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {},
});
