var app = getApp()
// pages/Earn/Ear.js
Page({

  data: {
    currentTab: 0,
  },
  /**
   * 页面的初始数据
   */


  //提现
  withdraw: function () {
    console.log('提现');
  },
  //返回上一页
  back:function(){
    wx.navigateBack({
      delta:1,
    })
  },
  //提醒发货
  




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;    
    console.log(options);
   var state = options.state;
   if(state == 0){
     that.setData({
       "currentTab": 0,
     })
   }
      //获取屏幕高度
      wx.getSystemInfo({
        success: function(res) {
          console.log(res.windowHeight);

        },
      })

    //点击之后获取到的值
    var value = getApp().tab;
    switch (value) {
      case "待支付":
        that.setData({
          "currentTab": 1,
        })
        break;

      case "待发货":
        that.setData({
          "currentTab": 2,
        })
        break;

      case "待收货":
        that.setData({
          "currentTab": 3,
        })
        break;

      case "待评价":
        that.setData({
          "currentTab": 4,
        })
        break;
    }
  },


  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
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