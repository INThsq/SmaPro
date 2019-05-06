// pages/BindPhone/BindPhone.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname:'',
    imgurl:'',
    noncestr:'',
    hides:false,
    visible: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannels();
    var content = wx.getStorageSync('content');
    var nickname = content.data.content.userinfo.member_oauth[0].nickname;
    var imgurl = content.data.content.userinfo.member_oauth[0].headimgurl;
    var is_card = content.data.content.userinfo.is_card;
    switch(is_card){
        case 0:
        this.setData({
          card_info:'未认证'
        });
        break;
      case 1:
        this.setData({
          card_info: '已认证'
        });
        break;
    }
    this.setData({
      nickname:nickname,
      imgurl:imgurl,
      is_card:is_card
    })
    var mobile = content.data.content.userinfo.mobile;
    if(mobile !="未绑定手机"){
      this.setData({
        hides: true
      })
    }else{
      hides:false
    }
  },

  getPhoneNumber: function (e) {
    let encryptedData = e.detail.encryptedData;
    if(encryptedData){
    var that = this;
    that.header(app.globalData.url+'bingPhone');
      wx.login({
        success:res=>{
          var code = res.code;
          var oauth_data = '';
          oauth_data = JSON.stringify({
            code:code,
            iv:e.detail.iv,
            encryptedData:e.detail.encryptedData
          })
          wx.request({
            url:app.globalData.url+'bingPhone',
            method: 'POST',
            header:that.data.header,
            data: {
              oauth_data: oauth_data
            },
            success:res=>{
              
              wx.showToast({
                title:res.data.msg
              })
              wx.setStorageSync('mobile', res.data.data.callback.mobile)
              that.setData({
                hides:true
              })
            }
          })
        }
      })
    }

  },
  Certification(){
    let is_card = this.data.is_card;
    switch(is_card){
      case 0:
        wx.navigateTo({
          url: '../Certification/Certification',
        })
      break;
      case 1:
        wx.navigateTo({
          url: '../CerSuc/CerSuc',
        })
        break;
    }
   
  },
  //退出登录
  editLogin(){
   var that = this;
   that.header(app.globalData.url+'destroy');
        wx.request({
          url: app.globalData.url+'destroy',
          method:'POST',
          header:that.data.header,
            success:res=>{
            if(res.data.code == 200){
              wx.showToast({
                title:res.data.msg,
              })
              wx.clearStorageSync('content');
              setTimeout(function () {
                  wx.switchTab({
                    url: '../UserCenter/userCenter',
                  })
              }, 1500)
            }else{
              utils.error(res);
            }
          }
        })
  },
  //个人信息
  toInfo(){
      wx.navigateTo({
        url: '../Info/Info',
      })
  },
  _onShowModal: function (e) {
    this.Modal.showModal();

  },
  _confirmEventFirst: function () {
    this.editLogin();
    this.Modal.hideModal();
    
  },
  _cancelEvent: function () {
    wx.showToast({
      title: '取消退出',
      icon: 'none',
      duration: 10000
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
      var session_id = wx.getStorageSync('session_id');
      var header = {
        "sign": password,
        "timestamp": timestamp,
        "noncestr": noncestr,
        "uuid": uuid,
        "token": token,
        "expirytime": expiry_time,
        "logintype": logintype,
        "Cookie": session_id
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

  }
})