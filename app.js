//app.js
import { ToastPannel } from './public/appToast/appToast'
import { ToastPannels } from './public/appToasts/appToasts'


var util = require('utils/md5.js') 
var app = getApp();
App({
  ToastPannel,
  ToastPannels,
  data:{
    arr: []
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
    this.globalData.noncestr = noncestr.toLowerCase();
  },
 onLoad(){
  
  new app.ToastPannel();
  new app.ToastPannels();
   wx.login({
      success: res => {
        console.log(res.code)
        this.globalData.code = res.code;
        wx.setStorageSync('codes', res.code)
      }
   })
 },
 
 onShow(options){
   this.globalData.scene = options.scene;
   let gift_queue_id = options.query.gift_queue_id;
   let order_num = options.query.order_num;
 },
  onLaunch: function (options) {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提醒',
              content: '检测到新版本哦~，是否立即重启？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '更新提醒',
              content: '新版本上线啦！请删除当前应用，重新搜索打开哦~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '温馨提醒',
        content: '当前微信版本过低无法使用该功能，请升级到最新微信版本后重试.'
      })
    }
    wx.login({
      success: res => {
        // console.log(res.code)
        this.globalData.code = res.code;
        wx.setStorageSync('codes', res.code)
      }
    })
    // 当前时间戳
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    this.globalData.timestamp = timestamp;
    //随机字符串
    this.randomWord();
    var noncestr = this.globalData.noncestr;
    //接口地址
    var api_url = 'https://api.myzy.com.cn/v1/wxLogin';
    var key = 'myzy3224326de100671291c7d1a6353ff6db';
    var arr = [api_url,key,noncestr,timestamp];
    var str = '';
    for (let i in arr) {
      str += arr[i];
    }
    //md5加密生成
    var password = '';
    password = util.hexMD5(str);
    password = password.toUpperCase();
    this.globalData.password = password
  //公用头部
    this.globalData.header= {
          'content-type': 'application/x-www-form-urlencoded',
            "sign":password,
            "timestamp": timestamp,
            "noncestr": noncestr,
    }
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  //改变地址状态的值
  changeAddressStart(type) {
    this.globalData.addressStart = type;
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
  globalData: {
    userInfo: null,
    addressStart: 1,//1新增,2编辑
    noncestr: '',
    header: null,
    openid: null,
    session_key: null,
    key: null,
    timestamp: null,
    token: null,
    mobile: null,
    uuid: null,
    // expiry_time:null,
    //个人中西状态值
    usrState: null,
    url:'https://api.myzy.com.cn/v1/',
    scene:'',
    
    phone:'10010',
    urls: 'https://api.myzy.com.cn/',
    //腾讯地图公共key值 
    key:'PLJBZ-VICWG-5OMQF-IJHEB-OEAPO-WYBNB',
    Tname:'惠选购',
    Bean:'惠选豆(劵)',
    Beans:'惠选豆'
  }
})