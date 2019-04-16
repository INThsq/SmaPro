// pages/RechSucess/RechSucess.js
var app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      czmoney:''
  },

  //跳转主页
  toIndex:function(){
    wx.navigateTo({
      url: '../Balance/Balance',
    })
    app.ban = 1;
  
  },
  toUser(){
    wx.switchTab({
      url:'../UserCenter/userCenter'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){ 
    console.log(options)
    var msgs = options.msgs;
    if(msgs){
      this.setData({
        msgs:msgs,
        cz:2
      })
    }else{
      var money = options.money;
      var msg = options.msg;
      var that = this;
      that.setData({
        //充值保留两位小数
        czmoney: Number(money).toFixed(2),
        msg: msg,
        cz:1
      })
      app.czmoney = 1;
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