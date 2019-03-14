// pages/Converted/Converted.js
var app = getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{
      address:null
      },
      num:1,
    total:99
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    var flag = false;
    flag = options.flag;
    if (flag) {
      var ad = {
        'realname': options.realname,
        'mobile': options.mobile,
        'address': options.address,
        'id': options.id
      }
      var detail = 'detail.address'
      this.setData({
        [detail]: ad
      })
    }
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    this.setData({
      num: num,
    });
    this.total();

  },
  total(){
    let num = this.data.num;
    let total = 99;
    total = num * 99;
    this.setData({
      total:total
    })
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回
    this.setData({
      num: num
    });
    this.total();
  },
  submits(){
    this.show('您的优惠豆不足，无法兑换')
  },
  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
    this.total();
  },
  //选择地址
  addAdress(e) {
    wx.navigateTo({
      url: '../Address/Address',
    })
    app.chooseType = 3;
    // var chooseAddress = getApp().chooseAddress;
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