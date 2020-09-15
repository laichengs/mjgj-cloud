// component/popup/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      title:String,
      isShow:{
        type:Boolean,
        value: false,
        observer:function(newVal,oldVal){
          console.log(newVal)
          this.setData({
            show: newVal
          })
        }
      }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.setData({show:false})
      this.triggerEvent("close",false)
    }
  }
})
