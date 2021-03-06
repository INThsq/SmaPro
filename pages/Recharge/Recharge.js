// pages/Deposit/Deposit.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
    visible: false,
    padTop:'',
    isShow:false
  },
  money: function (e) {
    app.czmoney = e.detail.value;
    this.setData({
      money: e.detail.value,
    })
  },
  //提现失败
  toDespositfalse: function () {
    this.show('充值金额超过余额')
  },
  //聚焦事件
  foucus(){
    this.setData({
      padTop:2
    })
  },
  //充值为0
  toDespositzero:function(){
    this.show('充值金额不能为0')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
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
  // 生成header
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
        "logintype": logintype
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
    // wx.navigateTo({
    //   url: '../RechSucess/RechSucess',
    // })
    // 
    this.Modal.hideModal();
    this.header(app.globalData.url + 'recharge');
    wx.request({
      url:app.globalData.url + 'recharge',
      method:"post",
      header:this.data.header,
      data:{
        total_fee:this.data.money,
        pay_type:3
      },
      success:res=>{
        if(res.data.code == 200){
          this.setData({
            isShow:true
          })
          let payment = res.data.data.callback;
            wx.requestPayment({
              timeStamp: payment.timeStamp,
              nonceStr: payment.nonceStr,
              package: payment.package,
              signType: payment.signType,
              paySign: payment.paySign,
              success(res) {
                if (res.errMsg == "requestPayment:ok") { 
                    setTimeout(function(){
                      wx.redirectTo({
                        url: '/pages/Balance/Balance',
                      })
                    },2000)
                }
              }
            })
            }

      }
    })
  },
  _cancelEvent: function () {
    this.show('充值失败');
  },
})