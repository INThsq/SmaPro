// pages/Bean_helps/Bean_helps.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp()
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
    let status = options.status;
    this.setData({
      status: status
    })
    //助力账单
    if(status!='2'){
      this.helpList(status);
    }else{
      this.virtualBillList(1);
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  //惠选豆详情
  helpList(status){
    this.header(app.globalData.url + 'helpList');
    wx.request({
      url: app.globalData.url + 'helpList',
      method:'get',
      header:this.data.header,
      data:{
        status: status
      },
      success:res=>{
        let help_list = res.data.data.callback.help_list;
        for (let i = 0; i < help_list.length;i++){
          for(let j = 0;j<help_list[i].length;j++){
            help_list[i][j].create_time = utils.formatTime(help_list[i][j].create_time,'Y-M-D h:m:s')
          }
        }
        if(res.data.code == 200){
            this.setData({
              list:help_list
            })
        }
      }
    })
  },
  //助力账单
  virtualBillList(now_page){
    this.header(app.globalData.url +'virtualBillList');
    wx.request({
      url: app.globalData.url + 'virtualBillList',
      method:'get',
      header:this.data.header,
      success:res=>{
        let bill_list = res.data.data.callback.bill_list;
        for(var l=0;l<bill_list.length;l++){
          bill_list[l].create_time = utils.formatTime(bill_list[l].create_time, 'Y-M-D h:m:s')
        }
        if(res.data.code ==  200){
          this.setData({
            bill_list: bill_list
          })
        }
      }
    })
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