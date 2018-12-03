// pages/Deposit/Deposit.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   money:null,
    visible: false
   
  },
  money: function (e) {
    app.txmoney = e.detail.value;
    
    this.setData({
      money: e.detail.value,
     
    })
  },
  //提现
 
  //提现失败

  toDespositfalse:function(){
    wx.showToast({
      title: '提现金额超过余额',
      icon: 'loading',
      duration: 10000
    })

    setTimeout(function () {
      wx.hideToast()
    }, 2000)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.Modal = this.selectComponent("#modal");
    

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

  },


  _onShowModal: function (e) {
    this.Modal.showModal();

  },
  _confirmEventFirst: function () {
    wx.navigateTo({
      url: '../Coindeposit/Coindeposit',
    })
    this.Modal.hideModal();
  },
  _cancelEvent: function () {
    wx.showToast({
      title: '提现失败',
      icon: 'none',
      duration: 10000
    })

    setTimeout(function () {
      wx.hideToast()
    }, 2000)
  },
})