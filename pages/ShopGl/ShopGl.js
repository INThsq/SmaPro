// pages/ShopGl/ShopGl.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionSheetItems: ['拍照', '打开相册'],
    base64: '',
    actionSheetHidden: true,
    showModalStatus: false
  },
  Save() {
    let member_mall_id = this.data.getStoreDetails.member_mall_id;
    let logo = this.data.base64;
    let detection = this.data.detail;
    this.setDetails(member_mall_id,logo,detection)
    
  },
  RZ() {
    this.showModal();
  },
  Close() {
    this.hideModal();
  },
  bindTextAreaBlur: function (e) {
    var that = this;
    that.setData({
      details: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let member_mall_id = options.id;
    new app.ToastPannel();

    this.getStoreDetails(member_mall_id);
  },
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
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
    console.log(text)
    this.setData({
      actionSheetHidden: true
    })
    if (text == '拍照') {
      this.chooseCrame();
    } else {
      this.chooseInt();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  chooseCrame() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        //设置头像  本地路径
        let tempFilePaths = res.tempFilePaths[0];
        this.setData({
          avatarUrl: tempFilePaths
        })
        //图片转码base64
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            this.setData({
              base64: res.data

            })
          }
        })
      }

    })
  },
  chooseInt() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        //设置头像  本地路径
        let tempFilePaths = res.tempFilePaths[0];
        this.setData({
          avatarUrl: tempFilePaths
        })
        //图片转码base64
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            this.setData({
              base64: res.data
            })
          }
        })
      }
    })
  },
  //店铺管理
  getStoreDetails(member_mall_id){
    let that = this;
    this.header(app.globalData.url+'getStoreDetails');
    wx.request({
      url:app.globalData.url + 'getStoreDetails',
      method: 'GET',
      header: that.data.header,
      data:{
        member_mall_id:member_mall_id
      },
      success: res => {
        if (res.data.code == 200) {
          var res = res.data.data.callback;
          switch(res.auth_type){
            case 1:
            res.auth_type ='个人';
            break;
            case 2:
            res.auth_type ='企业';
            break;
          }
          switch(res.type){
            case 1:
            res.type ='促销店铺';
            break;
            case 2:
            res.type ='普通店铺';
            break;
          }
        
          that.setData({
            getStoreDetails: res
          })
        }else{
          utils.error(res);
        }
      }
    })
  },
  //更新店铺信息
  setDetails(member_mall_id,logo,detection){
    this.header(app.globalData.url+'setDetails');
    wx.request({
      url:app.globalData.url+'setDetails',
      header:this.data.header,
      data:{
        member_mall_id:member_mall_id,
        logo:logo,
        detection:detection
      },
      method:'post',
      success:res=>{
        
        if(res.data.code == 200){
          this.show(res.data.msg)
        let cont = this.data.details;
        
          this.setData({
            cont: cont
          })
          this.hideModal();
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})