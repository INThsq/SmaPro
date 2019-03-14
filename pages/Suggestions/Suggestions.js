// pages/Suggestions/Suggestions.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    actionSheetItems: ['拍照', '打开相册'],
    actionSheetHidden: true,
    hide: true,
    photos:'',
    type_id:1,
    content:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.feedbackType();
    new app.ToastPannel();
  },
  clickTab: function (e) {
    var that = this;
    let index = e.currentTarget.dataset.id;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        type_id: index
      })
    }
  },
  listenerButton: function (e) {
    this.setData({
      //取反
      actionSheetHidden: !this.data.actionSheetHidden,
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
    that.setData({
      actionSheetHidden: true
    })
    this.chooseCrame();
    
  },
  chooseCrame() {
    var id = this.data.id;
    wx.chooseImage({
      count:3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        //设置头像  本地路径
        let tempFilePaths = res.tempFilePaths;
        if(tempFilePaths.length <= 3){
          this.setData({
            photos: tempFilePaths
          })
        }
      }
    })
  },
  //删除当前图片
  Del(e){
    let index = e.currentTarget.dataset.index;
    let photos = this.data.photos;
    photos.splice(index,1);
    this.setData({
      photos:photos
    })
  },
  //图片预览
  preview(e){
     let index = e.currentTarget.dataset.index;
    let photos = this.data.photos;
    wx.previewImage({
      current: photos[index], // 当前显示图片的http链接
      urls: photos,
    })
  },
  //留言
  bindTextAreaBlur(e){
    this.setData({
      content:e.detail.value
    })
  },
  //手机号
  getPhone(e) {
      this.setData({
        phone: e.detail.value,
      })
  },
  //提交表单
  submit(){
    let photos = this.data.photos;
    let contacts = this.data.phone;
    let content = this.data.content;
    let type_id = this.data.type_id;
    if(content == '' || contacts == ''){
      this.show('请输入您的反馈信息')
    }else{
      this.feedback(type_id,content,photos,contacts)
    }
  },
  //意见反馈请求
  feedback(type_id, content, images, contacts){
    this.header(app.globalData.url + 'feedback');
    let data = {
      type_id: type_id,
      content: content,
      images: images,
      contacts: contacts
    }
    let header = this.data.header;
    this.setData({
      ['header.content-type']: 'multipart/form-data',
    })
    let cookie =  wx.getStorageSync('cookie');
    if (cookie) {
      header.Cookie = cookie;
    }
    wx.uploadFile({
      url: app.globalData.url + 'ocrImage',
      method: 'post',
      header: header,
      name:'images',
      filePath:images[0],
      formData: data,
      success: res => {
          console.log(res)
      }
    })

  },
  //
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //列表
  feedbackType(){
    this.header(app.globalData.url +'feedbackType');
    wx.request({
      url: app.globalData.url + 'feedbackType',
      method:'get',
      header:this.data.header,
      success:res=>{
        this.setData({
          feedbackType:res.data.data.content
        })
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