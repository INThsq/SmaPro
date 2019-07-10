// pages/getCode/getCode.js
var app = getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top: '',
    info:'',
    code:2
  },
  //点击复制功能
  Ctrlc(e){
    let text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data:text,
       success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info =wx.getStorageSync('info');
    this.setData({
      info:info 
    })
    let code = options.code;
    if(code){
      this.setData({
        code:code
      })
    }
  },
  back: function () {
    let code = this.data.code;
    if(code == 1){
      wx.switchTab({
        url:"../UserCenter/userCenter"
      })
    }else{
      wx.navigateBack({
        delta: 1,
      })
    }
    
  },
  //滚动
  scrollTopFun(e) {
    var top = e.detail.scrollTop;
    var that = this;
    that.setData({
      top: top
    })
  },
  //保存图片
  save(){
      wx.downloadFile({
        url:this.data.info.qr_code,
        success: function (res) {
          
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (dres) {
              console.log(dres);
            }
          })
        }
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