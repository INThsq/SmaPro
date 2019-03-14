// pages/CardInfo/CardInfo.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    bankNumber:'',
    phone:'',
    hide:true,
    gets:false,
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannels();
    if(options){
      let realname = options.realname;
      let is_cards = options.id_card;
      this.setData({
        realname:realname,
        id_card:is_cards
      })
    }
  },
  //姓名
  getUserIdCardName: function (e) {
    this.setData({
      name: e.detail.value,
    })
   
   
  },
  //提交
  submit(){
    let mobile = this.data.phone;
    if (mobile.length == 0) {
      this.shows('请输入手机号！');
      return false;
    }
    if (mobile.length != 11) {
      this.shows('手机号长度有误！');
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      this.shows('手机号长度有误！');
      return false;
    }
    let name = this.data.name;
    if(name){
      var realname = this.data.name;
    }else{
      var realname = this.data.realname
    }
    var bank_card = this.data.num;
     mobile = mobile;
    var id_card = this.data.id_card;

    this.bindBank(realname, bank_card, mobile, id_card)
  },
  //手机号
  getPhone(e){
    let num = this.data.num;
    if(num.length == 0){
      this.shows('请输入合法卡号')
      this.setData({
        phone:'',
      })
    }else{
      this.setData({
        phone: e.detail.value,
      })
    }
   
  },
  bindblur(e){
    this.setData({
      gets: false,
    })
    let num = this.data.num;
    if (num) {
      this.checkBank(num)
    }
  },
 
  //银行卡号
  getUserIdCardNumber: function (e) {
    let name = this.data.name;
    let realname = this.data.realname;
    if(realname||name.length >1){
      let card = e.detail.value;
      card = card.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      this.setData({
        bankNumber: card
      })
      let cards = card.replace(/\s|\xA0/g, "");
      this.setData({
        num:cards
      })
    }else{
      this.shows('姓名不合法')
      this.setData({
        num:'',
        bankNumber:''
      })
    }
   
  },
  //检测银行卡号
  checkBank(bank_card){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url + 'checkBank')
    let header = this.data.header;
    let cookie = getApp().cookie;
    console.log(cookie)
    if (cookie) {
      header.Cookie = cookie;
    }
    wx.request({
      url: app.globalData.url + 'checkBank',
      method: 'GET',
      header:header,
      data:{
        bank_card:bank_card
      },
      success: res => {
        this.setData({
          isShow:false,
          cookie: res.header['Set-Cookie']
        })
        if (res.data.code == 200) {
            this.setData({
                bank:res.data.data.content,
                hide:false,
            })
        } else {
              this.shows(res.data.msg);
              
        }
      }
    })
  },
  //
  //绑定银行卡
  bindBank(realname, bank_card, mobile, id_card){
    this.header(app.globalData.url + 'bindBank');
    let header = this.data.header;
    let cookie = this.data.cookie;
    if(cookie){
      header.Cookie = cookie;
    }
    this.setData({
      ['header.content-type']: 'application/x-www-form-urlencoded',
    })
    wx.request({
      url: app.globalData.url + 'bindBank',
      method:'POST',
      data:{
        realname:realname,
        bank_card: bank_card,
        mobile: mobile,
        id_card: id_card
      },
      header:header,
      success:res=>{
        if(res.data.code == 200){
          wx.navigateTo({
            url: '../CardSucc/CardSucc',
          })
        }else{
          this.shows(res.data.msg)
        }
      }
    })
  },  
  /**ffff
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //

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
})