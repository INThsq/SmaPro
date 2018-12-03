// pages/CareShop/CareShop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top:'',
    //收藏
    collect:'http://oss.myzy.com.cn/wechat/images/icon_sjzx_sc.png',
    datacol:'0',
    imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_h.png',
    dataindex:0,
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    }, 
  },
  tabFun: function (e) {
    //获取触发事件组件的dataset属性 
    var _datasetId = e.target.dataset.id;
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj
    });
  }, 
  //点击收藏
  collect:function(e){
    // var col = e.target.dataset.col;
    var that = this;
    that.setData({
      collect: 'http://oss.myzy.com.cn/wechat/images/icon_sjzx_sch.png',
    
    })
    wx.showToast({
      title: '收藏成功',  //标题
      duration: 2000, //提示的延迟时间，单位毫秒，默认：1500

    })
  },
  // 价格排序
  changechoose:function(e){
    var index = e.target.dataset.index;
    console.log(index);
    index ++;
    var that = this;
    if(index == 1){
      that.setData({
        dataindex: index,
        imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_s.png'
      })
    }else if(index == 2){
      that.setData({
        dataindex: index,
        imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_x.png'
      })
    }else{
      that.setData({
        dataindex: 1,
        imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_s.png'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  scrollTopFun(e) {
    console.log('333');
    var top = e.detail.scrollTop;
    console.log(top);
    var that = this;
    that.setData({
      top:top
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})