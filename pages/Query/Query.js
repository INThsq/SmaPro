// pages/Query/Query.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp()
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.dot_num){
      console.log(options.dot_num)
      this.setData({
        scene_num: options.dot_num
      })
    }
    new app.ToastPannels();
    let order_num = options.order_num;
    let scene_status = options.scene_status;
    let scene_type = options.scene_type;
    this.setData({
      order_num:order_num,
      scene_status:scene_status,
      scene_type:scene_type
    })
  },

  //扫描二维码
  ScanCode(){
    wx.scanCode({
      success:res=>{
        var str = res.result;
        var index = str.lastIndexOf("=");
        str = str.substring(index + 1, str.length);
        this.setData({
          scene_num: str
        })
      }
    })
  },
 
  //获取取货凭证
  Query(){
    let content = wx.getStorageSync('content');
    if(content){
      let scene_num = this.data.scene_num;
      let scene_type = this.data.scene_type;
      if (scene_num) {
        if(scene_type){
          this.proofLists(scene_num)
        }else{
          this.proofList(scene_num)

        }
      } else {
        this.shows('请输入提货网点编号')
      }
    }else{
        wx.navigateTo({
          url:'../Accredit/Accredit'
        })
    }
   
  },
  back(){
    let scene = getApp().scene;
    console.log(scene)
    if(scene == 0){
        this.distribution();
        app.scene =1
    }else{
      wx.navigateBack({
        delta: 1
      })
    }
  },
  keyword(e){
    this.setData({
      scene_num: e.detail.value
    })
  },
  //取货凭证获取
  proofList(scene_num){
    this.header(app.globalData.url +'proofList');
    wx.request({
      url: app.globalData.url +'proofList',
      method:'get',
      header:this.data.header,
      data:{
        dot_num:scene_num,
      },
      success:res=>{
        if(res.data.code == 200){
          wx.navigateTo({
            url: '../Voucher/Voucher?scene_num=' +scene_num
          })
        }else if(res.data.code == 401){
            wx.navigateTo({
              url: '../NoQuery/NoQuery?error=' + JSON.stringify(res.data) + '&scene_num=' + scene_num
            })
        }else{
          this.shows(res.data.code);
          wx.navigateTo({
            url:'../Accredit/Accredit'
          })
        }
      }
    })
  },
  // 分销中心
  distribution(){
    this.header(app.globalData.url +'distribution');
    wx.request({
      url: app.globalData.url +'distribution',
      header:this.data.header,
      method:'get',
      data:{
        scene:0,
        order_num:'',
        goods_id:0,
        member_mall_id:0
      },
      success:res=>{
        if(res.data.code ==200){
          wx.navigateTo({
            url:'../FyCenter/FyCenter?top='+JSON.stringify(res.data.data.callback)
          })
         
        }
      }
    })
  },
  proofLists(scene_num){
    this.header(app.globalData.url +'proofList');
    var scene_type = this.data.scene_type;
    var scene_status = this.data.scene_status;
    var order_num = this.data.order_num;
    wx.request({
      url: app.globalData.url +'proofList',
      method:'get',
      header:this.data.header,
      data:{
        dot_num:scene_num,
      },
      success:res=>{
        if(res.data.code == 200){
          this.giftHandlings(scene_type,scene_status,order_num,scene_num)
        }else if(res.data.code == 401){
            wx.navigateTo({
              url: '../NoQuery/NoQuery?error=' + JSON.stringify(res.data) + '&scene_num=' + scene_num
            })
        }else{
          this.shows(res.data.msg)
          wx.navigateTo({
            url:'../Accredit/Accredit'
          })
        }
      }
    })
  },
  giftHandlings(scene_type,scene_status,order_num,dot_num){
    this.header(app.globalData.url+'giftHandling');
    wx.request({
      url:app.globalData.url+'giftHandling',
      header:this.data.header,
      method:'POST',
      data:{
        scene_type:scene_type,
        scene_status:scene_status,
        order_num:order_num,
        dot_num:dot_num
      },
      success:res=>{
          this.shows(res.data.msg)
          wx.navigateTo({
            url:'../Voucher/Voucher?off=1'
          })
          app.callback = res.data.data.callback
          
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
})