// component/price/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    color: {
      type: String,
      value: '#000',
    },
    family: {
      type: String,
      value: 'Din',
    },
    prefix: {
      type: Boolean,
      value: true,
    },
    size: {
      type: Number,
      value: 28,
    },
    showSuffix: {
      type: Boolean,
      value: true,
    },
    prefixSize: {
      type: Number,
      value: 24,
    },
    suffixSize: {
      type: Number,
      value: 28,
    },
    value: String,
  },
  observers: {
    value: function (newVal, oldVal) {
      const index = newVal.indexOf('.');
      if (index < 0) {
        this.setData({
          amount: this._split(newVal),
        });
      } else {
        this.setData({
          amount: this._split(newVal.substring(0, index)),
          suffix: newVal
            .substring(index + 1)
            .substring(0, 2)
            .padEnd(2, '0'),
        });
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    amount: 0,
    suffix: '00',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _split(amount) {
      if (amount.length > 3) {
        return (
          amount.substring(0, amount.length - 3) +
          ',' +
          amount.substring(amount.length - 3)
        );
      }
      return amount;
    },
  },
});
