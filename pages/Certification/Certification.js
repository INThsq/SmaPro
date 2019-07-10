// pages/Certification/Certification.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl1: 'http://oss.myzy.com.cn/wechat/images/imag_shenfenzheng3.png',
    avatarUrl2: 'http://oss.myzy.com.cn/wechat/images/imag_shenfenzheng4.png',
    actionSheetItems: ['拍照', '打开相册'],
    base641:'',
    base642:'',
    actionSheetHidden: true,
    hide:true
  },
  listenerButton: function (e) {
    let id = e.currentTarget.dataset.id;
    
    this.setData({
      //取反
      actionSheetHidden: !this.data.actionSheetHidden,
      id:id
    });
  },
  listenerActionSheet: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  itemChange(e) {
    var text = e.target.dataset.text;
    var that = this;
    var id = this.data.id;
    that.setData({
      actionSheetHidden: true
    })
    if (text == '拍照') {
      this.chooseCrame(id);
    } 
    else {
      this.chooseInt(id);
    }
  },
  chooseCrame(id){
    var id = this.data.id;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        //设置头像  本地路径
        let tempFilePaths = res.tempFilePaths[0];
        if (id == 1) {
          this.ocrImage('front', tempFilePaths, 'front', id, tempFilePaths)
        } else {
          this.ocrImage('back', tempFilePaths, 'back', id, tempFilePaths)
        }
      }
    })
  },
  chooseInt(id){
    var id = this.data.id;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        //设置头像  本地路径
        let tempFilePaths = res.tempFilePaths[0];
        if (id == 1) {
          this.ocrImage('front', tempFilePaths, 'front', id, tempFilePaths)
        } else {
          this.ocrImage('back', tempFilePaths, 'back', id, tempFilePaths)
        }
      }
    })
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
// 图片识别
  ocrImage(back, file, slide, id, tempFilePaths){
    this.setData({
      hide: false
    })
    this.header(app.globalData.url +'ocrImage');
    let data ={
      [back]: file,
      side: slide
    }
    let header = this.data.header;
   
    wx.uploadFile({
      url: app.globalData.url + 'ocrImage',
      method:'post',
      header:header,
      name:back,
      filePath: tempFilePaths,
      formData: data,
      success:res=>{
          this.setData({
          hide: true
        })
        var res = res.data;
        res = JSON.parse(res);
        this.setData({
          hide: true
        })
        if(res.code == 200 ){
          this.show(res.msg)
          console.log(id);
          if(id == 1){
            this.setData({
              avatarUrl1: tempFilePaths
            });
          }else{
             this.setData({
               avatarUrl2: tempFilePaths
             });
          }
        
        }else{
          this.show(res.msg)
          this.setData({
            hide: true
          })

        }
      }
    })
  },
  //实名认证提交
  realname(){
    this.header(app.globalData.url +'realname');
    let header = this.data.header;
    wx.request({
      url: app.globalData.url + 'realname',
      header:header,
      method:'post',
      success:res=>{
        if(res.data.code == 200){
          this.show(res.data.msg)
          wx.navigateTo({
            url: '../CerSuc/CerSuc?type=1',
          })
        }else{
          this.show(res.data.msg)
        }
      }
    })
  },
 
  //实名认证
  Sure(){
    this.realname();
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
  // 生成header
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
})