// pages/BankCard/BankCard.js
var app = getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBankOwner();
    this.bankList();
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
  //跳转添加银行卡
  bind(){
    let bank = this.data.bank;
    let is_card = this.data.is_card;
    if (is_card == 0){
      this.Modal.showModal();
    }else{
      let realname = this.data.realname;

      wx.navigateTo({
        url: '../CardInfo/CardInfo?realname=' + realname + '&id_card=' + is_card,
      })
    }
   
  },
  _confirmEventFirst: function () {
    this.Modal.hideModal();
    wx.navigateTo({
      url: '../Certification/Certification',
    })

  },
  _cancelEvent: function () {
    this.Modal.hideModal();
    
  },
  //银行卡列表
  getBankOwner(){
    this.header(app.globalData.url + 'getBankOwner')
    wx.request({
      url: app.globalData.url + 'getBankOwner',
      method: 'GET',
      header: this.data.header,
      success: res => {
        if (res.data.code == 200) {
            this.setData({
              realname: res.data.data.member_info.realname,
              is_card: res.data.data.member_info.id_card,
            })
        } else {
          this.setData({
            is_card:0,
          })
        }
      }
    })
  },
  bankList(){
    this.header(app.globalData.url + 'bankList')
    wx.request({
      url: app.globalData.url + 'bankList',
      method: 'GET',
      header: this.data.header,
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            bankList: res.data.data.content
          })
        } else {
          this.show(this.data.msg)
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