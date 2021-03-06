// pages/Balance/Balance.js
var app = getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js'); 


Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    noncestr:'',
    balance:''
  },
  Back(){
    wx.navigateTo({
      url: '/pages/userCenter/userCenter',
    })
  },
  //提现跳转
  deposit: function () {
    let content = wx.getStorageSync('content');
    if (content) {
      wx.navigateTo({
        url: '../Deposit/Deposit',
      })
    } else {
      wx.navigateTo({
        url: '../Accredit/Accredit',
      })
    }
   
  },
  //银行卡跳转
  bankCard(){
    let content = wx.getStorageSync('content');
    if (content) {
      wx.navigateTo({
        url: '../BankCard/BankCard',
      })
    } else {
      wx.navigateTo({
        url: '../Accredit/Accredit',
      })
    }
  },
  //跳转充值
  recharge:function(){
    let content = wx.getStorageSync('content');
    if(content){
      wx.navigateTo({
        url: '../Recharge/Recharge',
      })
    }else{
      wx.navigateTo({
        url: '../Accredit/Accredit',
      })
    }
   
  },
  //账户详情 跳转
  toBill(){
    wx.navigateTo({
      url: '../Bill/Bill',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that= this;
   that.header(app.globalData.url+'finance')
    wx.request({
      url:app.globalData.url+'finance',
      method:'GET',
      header:that.data.header,
      success: res =>{
        if(res.data.code == 200){
          that.setData({
            balance: res.data.data.content.balance
          })
        }else{
          utils.error(res);
        }
      }
    })

  },
  //生成随机字符串
  randomWord() {
    var noncestr;
    noncestr = '';
    var noncestrLength = 8;
    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    for (var i = 0; i < noncestrLength; i++) {
      var index = Math.floor(Math.random() * 36);
      noncestr += random[index];
    }
    this.data.noncestr = noncestr.toLowerCase();
  },
  //生成header
  header(url) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    this.randomWord();
    var noncestr = this.data.noncestr;
    var api_url = url;
    var key = 'myzy3224326de100671291c7d1a6353ff6db';
    var arr = [api_url, key, this.data.noncestr, timestamp];
    var str = '';
    for (let i in arr) {
      str += arr[i];
    }
    //md5加密生成
    var password = '';
    password = util.hexMD5(str);
    password = password.toUpperCase();
    //发起请求
    var content = wx.getStorageSync('content');
    if (content) {
      var uuid = content.data.uuid;
      var token = content.data.token;
      var expiry_time = content.data.expiry_time;
      var logintype = content.data.login_type;
      var header = {
        "sign": password,
        "timestamp": timestamp,
        "noncestr": noncestr,
        "uuid": uuid,
        "token": token,
        "expirytime": expiry_time,
        "logintype":logintype
      }
    } else {
      var header = {
        "sign": password,
        "timestamp": timestamp,
        "noncestr": noncestr,
      }
    }



    this.setData({
      header: header
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