// pages/Voucher/Voucher.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp();
var WxParse = require('../../components/wxParse/wxParse.js');
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
    if(options.q){
      app.scene =0;
      
     
      // qrUrl = JSON.parse(qrUrl);
      var referee_data = qrUrl;
      let qrUrl = decodeURIComponent(options.q);
      let index = qrUrl.lastIndexOf('=');
      dot_num = qrUrl.substring(index+1,qrUrl.length);
      console.log(dot_num)
      let content = wx.getStorageSync('content');
      if(content){
        this.setData({
          code:201
        })
        wx.navigateTo({
          url: '../Query/Query?dot_num=' + dot_num
        })
      }else{
        this.setData({
          code: 201
        })
        wx.navigateTo({
          url: '../Accredit/Accredit?dot_num=' + dot_num,
        })
      }

    }else{
      this.setData({
        code: 200
      })
      let callback = getApp().callback;
      let off = options.off;

      if (callback) {
        WxParse.wxParse('article', 'html', callback.one_code, this, 5);
        this.setData({
          callback: callback,
          scene_type: callback.scene_type,
          json: callback,
          scene_num: callback.remind.scene_num,
          off: off
        })
      }
      var  dot_num = options.scene_num || callback.mall_dot.dot_num;
      if (dot_num) {
        this.setData({
          dot_num: dot_num
        })
        this.proofList(dot_num)
      }
    }
   
    
  },
  //查看更多
  More(){
    wx.navigateTo({
      url: '../Notgifts/Notgifts?gift=1&&curs=0&&tab=1',
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
          WxParse.wxParse('article', 'html', res.data.data.callback.one_code, this, 5);
          this.setData({
            callback:res.data.data.callback,
            scene_type:res.data.data.callback.scene_type,
            json:res.data.data.callback.proo_flist,
            scene_num:res.data.data.callback.remind.scene_num
          })
      }else{
        // this.shows(res.data.code);
      }
    }
  })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.Modal = this.selectComponent("#modal");

  },
  confirm: function (e) {
    let content = wx.getStorageSync('content');
    if(content){
      let id = e.currentTarget.dataset.id;
      this.setData({
        id:id
      })
      this.Modal.showModal();
    }else{
      wx.navigateTo({
        url:'../Accredit/Accredit'
      })
    }
    
},
  _confirmEventFirst: function () {
    let scene_num = this.data.scene_num;
    if(scene_num){
      this.setData({

        giveaway_num:scene_num
      })
    }else{
      this.setData({
        giveaway_num:''
      })
    }
    let scene_type  = this.data.scene_type;
    let dot_num = this.data.dot_num;
    this.confirmDelivery(scene_type,dot_num,scene_num)
    this.Modal.hideModal();
   
  },
  _cancelEvent: function () {
    this.shows('未确认收货')
  },
  //申请核销
  confirmDelivery(scene_type,dot_num,giveaway_num){
      var off = this.data.off;
      this.header(app.globalData.url +'confirmDelivery');
      wx.request({
        url: app.globalData.url +'confirmDelivery',
        method:'POST',
        header:this.data.header,
        data:{
          scene_type:scene_type,
          dot_num:dot_num,
          giveaway_num:giveaway_num
        },
        success:res=>{
          if(res.data.code == 200){
            this.shows(res.data.msg);
            if(off){
                wx.navigateTo({
                    url:"../Notgifts/Notgifts?gift=1&curs=1"
                })
            }else{
              this.distribution()
            }
           
          }else{
            this.shows(res.data.msg)
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
        app.scenes = 1;
        if(res.data.code ==200){
          wx.navigateTo({
            url:'../FyCenter/FyCenter?top='+JSON.stringify(res.data.data.callback)
          })
         
        }
      }
    })
  },









  //确认收货
  // confirmDelivery(scene, keywords){
  //   this.header(app.globalData.url +'confirmDelivery');
  //   wx.request({
  //     url: app.globalData.url +'confirmDelivery',
  //     method:'POST',
  //     header:this.data.header,
  //     data:{
  //       scene:scene,
  //       keywords:keywords
  //     },
  //     success:res=>{
  //       if(res.data.code == 200){
  //         this.shows(res.data.msg)
  //         wx.navigateTo({
  //           url:'../Notgifts/Notgifts?cur=1'
  //           })
  //       }else{
  //         this.shows(res.data.msg)
  //       }
  //     }
  //   })
  // },
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