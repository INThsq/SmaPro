// common/nyz_area_picker/nyz_area_picker.js
var areaTool = require('../../utils/area.js');
var index = [2]
var provinces = areaTool.getProvinces();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{    //控制area_select显示隐藏
      type:Boolean,
      value:false
    },
    maskShow:{    //是否显示蒙层
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    provinces: provinces,
    value:[2],
    province: '家居',
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleNYZAreaChange: function (e) {
      var that = this;
      var value = e.detail.value;
      if (index[0] != value[0]) {
        index = [value[0]]
        that.setData({
          value: [index[0]],
          province: provinces[index[0]]
        })
      }
    },
    //  * 确定按钮的点击事件
     
    handleNYZAreaSelect:function(e){
      //console.log("e:" + JSON.stringify(e));
      var myEventDetail = e; // detail对象，提供给事件监听函数
      var myEventOption = {}; // 触发事件的选项
      this.triggerEvent('sureSelectArea', myEventDetail, myEventOption)
    },
    /**
     * 取消按钮的点击事件
     */
    handleNYZAreaCancle:function(e){
      var that = this;
      that.setData({
        show:false
      })
    }
  }
})
