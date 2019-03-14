// pages/Coindeposit/Coindeposit.js
var app = getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
      txmoney:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cz = getApp().txmoney;
    var that = this;
    that.setData({
      //充值保留两位小数
      txmoney: Number(cz).toFixed(2),
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
//处理结果
  
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
  
})