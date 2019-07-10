// pages/SetOrder/SetOrder.js
var util = require('../../utils/md5.js')
var utils = require('../../utils/util.js')
var app = getApp();
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
    new app.ToastPannels();
    let id = options.id;
    console.log(id)
    this.giveHandleOrder(id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.Modal = this.selectComponent("#modal");
  },
  Apply(){
    this.Modal.showModal();
  },
  _confirmEventFirst(){
    this.handleToMot();
    this.Modal.hideModal();
   
  },
  _cancelEvent(){
    this.Modal.hideModal();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //申请结算
  giveHandleOrder(mall_dot_authorize_id) {
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url + 'giveHandleOrder');
    wx.request({
      url: app.globalData.url + 'giveHandleOrder',
      header: this.data.header,
      data: {
        mall_giveaway_authorize_id: mall_dot_authorize_id
      },
      method: 'get',
      success: res => {
        this.setData({
          isShow: false
        })
        if (res.data.code = 200) {
          this.setData({
            give: res.data.data.callback
          })
        } else {
          this.shows(res.data.code)
        }
      }
    })
  },
  Title(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      Toast: id
    })
    this.setData({
      isShows: true,
    })
  },
  Sure() {
    this.setData({
      isShows: false
    })
  },
  //申请立即结算
  handleToMot(){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url +'handleToMot');
    wx.request({
      url: app.globalData.url +'handleToMot',
      header:this.data.header,
      method:'post',
      success:res=>{
        this.setData({
          isShow: false
        })
          this.shows(res.data.msg)
          if(res.data.code == 200){
            wx.navigateTo({
              url: '../Record/Record?scene_type=0&&way=1',
            })
          }else{
            this.shows(res.data.msg)

          }
      }
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