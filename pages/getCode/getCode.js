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
    let code = options.code;
    if(code){
      this.setData({
        code:code
      })
    }
    this.getCode();
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
  //获取二维码
  getCode(){
    this.setData({
      isShow:true
    })
    var that = this;
    that.header(app.globalData.url+'getQrCode');
    wx.request({
      url: app.globalData.url + 'getQrCode',
      method: 'GET',
      header:that.data.header,
      success: res => {
        this.setData({
          isShow:false
        })
        if(res.data.code == 200){
          this.setData({
            info: res.data.data.content
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