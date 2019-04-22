// pages/Record/Record.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0
  },
  //
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannels();
    let scene_type = options.scene_type;
    let settle_status = this.data.currentTab;
    let way = options.way;
    this.setData({
      scene_type:scene_type,
      way:way
    })
    this.settleList(settle_status,1)
  },
  onReady: function () {
    this.Modal = this.selectComponent("#modal");
  },
  back(){
    let way = this.data.way;
    console.log(way)
    if (way == 0){
      wx.navigateBack({
        delta:1
      })
    }else{
      wx.navigateBack({
        delta:2
      })
    }
    
  },
  //结算列表
  settleList(settle_status,now_page){
    this.setData({
      isShow:true
    })
      this.header(app.globalData.url+'settleList');
      wx.request({
        url:app.globalData.url+'settleList',
        header:this.data.header,
        data:{
          settle_status:settle_status,
          now_page:now_page
        },
        method:'get',
        success:res=>{
          for(let t=0;t<res.data.data.callback.settle_list.length;t++){
            res.data.data.callback.settle_list[t].create_time = utils.formatTime(res.data.data.callback.settle_list[t].create_time,'Y-M-D h:m:s')
          }
          this.setData({
            isShow:false,
            settle_list:res.data.data.callback.settle_list
          })
          
        }
      })
  },
  //确认核销
  Confirm(e){
    console.log(e)
    let giveaway_handle_id = e.currentTarget.dataset.handle;
    let mall_dot_authorize_id = e.currentTarget.dataset.autid;
    this.setData({
      giveaway_handle_id:giveaway_handle_id,
      mall_dot_authorize_id:mall_dot_authorize_id
    })
    this.Modal.showModal();
  },

  _confirmEventFirst: function () {
    let giveaway_handle_id = this.data.giveaway_handle_id;
    let mall_dot_authorize_id = this.data.mall_dot_authorize_id;
    this.finishSettle(giveaway_handle_id,mall_dot_authorize_id)
  this.Modal.hideModal();
  },
    _cancelEvent: function () {
  this.Modal.hideModal();
    },
  
  //门店确认核销
  finishSettle(giveaway_handle_id,mall_dot_authorize_id){+
      this.setData({
        isShow:true
      })
      this.header(app.globalData.url + 'finishSettle'),
      wx.request({
        url:app.globalData.url+'finishSettle',
        header:this.data.header,
        method:'post',
        data:{
          giveaway_handle_id:giveaway_handle_id,
          mall_dot_authorize_id:mall_dot_authorize_id
        },
        success:res=>{
          this.shows(res.data.msg)
          this.setData({
            isShow:false
          })
          if(res.data.code == 200){
            this.setData({
              currentTab:1
            })
            this.settleList(1,1)
          }
         
        }

      })
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    var currentTab = e.target.dataset.current;
    this.settleList(currentTab,1);
    if (this.data.currentTab === currentTab) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
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