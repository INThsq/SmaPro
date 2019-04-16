// pages/FreeConvert/FreeConvert.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //跳转兑换记录
  Exchange(){
    wx.navigateTo({
      url: '../Bean_helps/Bean_helps?status=2',
    })
  },
  Get(){
    wx.navigateTo({
      url: '../Converted/Converted',
    })
  }, 
  //跳转
  Records(){
    wx.navigateTo({
      url: '../Records/Records',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      Beans: app.globalData.Beans,
      Bean: app.globalData.Bean
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