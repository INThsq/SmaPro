// pages/EarnMoney/EarnMoney.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
      data:1,
      height:352,
      flag:false,
      attentionAnim:'',
      top:'',
      second:6,
      num:1,
      text:'立即领取(包邮)',
      gift:[
        {name:'INT成功领取礼物'},
        { name: 'INT1成功领取礼物' },
        { name: 'INT3成功领取礼物' },
        { name: 'INT5成功领取礼物' }
        ],
      obj : [ ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    let content = wx.getStorageSync('content');
    this.setData({
      content: content
    })
    let gift_queue_id = options.gift_queue_id;
    let order_num = options.order_num;
    let goods = options.goods;
    let scene = app.globalData.scene;
    this.setData({
      goods:goods,
      gift_queue_id: gift_queue_id,
      order_num: order_num
    })
    //有场景显示
    if (scene == 1036 || scene == 1037 || order_num) {
      this.getGifts(gift_queue_id, order_num)
    }
  },
  // 跳转
  goStart(){
    wx.navigateTo({
      url: '../Robmoney/Robmoney?type=2',
    })
  },
  //5s倒计时
  count(){
    let second = this.data.second
    let that = this
    let inter = setInterval(function(){
      second --
      that.setData({
        second:second,
        text: '领取成功，挑选商品（' + second + 's）'
      })
      if(second == 0){
        clearInterval(inter)
      }
    },1000)
  },
  push(){
    this.count()
    var data = this.data.data;
    data++;
    this.setData({
      data:data,
    })
    if(data == 3){
      this.setData({
        obj:this.data.obj
      })
    }
  },
  // 展开全部
  unfold(){
    this.setData({
      flag:true,
      height:117.3 * this.data.obj.lenght
    })
  },
  //滚动
  scrollTopFun(e) {
      var top = e.detail.scrollTop;
      var that = this;
      that.setData({
        top: top
      })
    },
  //获取礼品
  getGifts(gift_queue_id, order_num){
    console.log('111');
    let that = this
    that.header(app.globalData.url +'getGifts')
    wx.request({
      url: app.globalData.url +'getGifts',
      method:'post',
      header:that.data.header,
      data:{
        gift_queue_id: gift_queue_id,
        order_num: order_num
      },
      success:res=>{
        this.setData({
            code:res.data.code
        })
        if(res.data.code == 200){
          that.setData({
            getGifts: res.data.data.callback,
            obj: res.data.data.callback.gift_praise
          })
        }
          else if(res.data.code == 402){
              wx.navigateTo({
                 url: '../Startgroup/Startgroup?id=' + res.data.data.callback.mall_goods_id+'&goods'+ this.data.goods+'&type=1',
              })
          }else{
             this.show(res.data.msg);
             setTimeout(function(){
                wx.switchTab({
                  url: '../index/index',
                })
             },1000)
             
          }
        
      }
    })
  },
  //立即领取
  receiveGift(gift_queue_id, order_num){
    let that = this
    that.header(app.globalData.url + 'receiveGifts')
    wx.request({
      url: app.globalData.url + 'receiveGifts',
      method: 'post',
      header: that.data.header,
      data: {
        gift_queue_id: gift_queue_id,
        order_num: order_num
      },
      success: res => {
        if (res.data.code == 200) {
          console.log(res.data)
          that.show(res.data.msg)
          let member_oauth = res.data.data.callback.member_oauth;
          member_oauth.allot_money = res.data.data.callback.gift_praise.reward_money
          let obj = that.data.obj;
          obj.unshift(member_oauth)
       

          that.setData({
            button_text: res.data.data.callback.gift_praise.button_text,
            reward_money: res.data.data.callback.gift_praise.reward_money,
            obj:obj,
            gets:1
          })
          }else if(res.data.code == 4){
          this.setData({
            // button_text: res.data.msg,
            // ['getGifts.get_gifts_text']: res.data.msg,
            ['getGifts.receive_gifts_status']: 0
          })
          }else{
          this.setData({
            button_text: res.data.msg,
            ['getGifts.get_gifts_text']:res.data.msg,
            ['getGifts.receive_gifts_status']:1
          })
        }
      }
    })
  },
  //点击领取
  receiveGifts(){
    console.log('333');
    let receive_gifts_status = this.data.getGifts.receive_gifts_status
    let gift_queue_id = this.data.gift_queue_id
    let order_num = this.data.order_num
    let gets = this.data.gets
    if (gets) {
      wx.navigateTo({
        url: '../Notgifts/Notgifts',
      })
    }else{
      switch (receive_gifts_status) {
        case 0:
          this.receiveGift(gift_queue_id, order_num)
          break;
        case 1:
          this.show('领取已经结束')
          setTimeout(()=>{
            wx.switchTab({
              url: '../index/index',
            })
          })
      } 
    }
  },
  //获取授权信息
  bindGetUserInfo: function (e) {
    getApp().globalData.userInfo = e.detail;
    wx.setStorageSync('userInfo', e.detail);
    var referee_id = '';
    this.setData({
      userInfo: e.detail.userInfo
    })
    var userInfo = e.detail;
    userInfo.referee_id = referee_id;
    if (e.detail.userInfo) {
      wx.login({
        success: res => {
          var code = res.code;
          userInfo.code = code;
          wx.request({
            url: app.globalData.url + 'wxLogin',
            method: 'POST',
            header: app.globalData.header,
            data: {
              login_type: 2,
              client_type: 3,
              client_version: '1.0.0',
              oauth_data: JSON.stringify(userInfo)
            },
            success: res => {
              //返回值为401的情况下  未授权  跳转授权页面
              if (res.data.code == 401) {
                wx.removeStorageSync('content')
              } else if (res.data.code == 200) {
                this.show(res.data.msg)
                this.setData({
                  uuid: res.data.data.uuid,
                  token: res.data.data.token,
                  expiry_time: res.data.data.expiry_time,
                  logintype: res.data.data.expiry_time
                })
                //已登录情况下为2  后台获取到的信息渲染到页面上
                //生成header
                var uuid = res.data.data.uuid;
                var token = res.data.data.token;
                var expiry_time = res.data.data.expiry_time;
                //本地存储
              

                var timestamp = Date.parse(new Date());
                timestamp = timestamp / 1000;
                this.randomWord();
                var noncestr = this.data.noncestr;
                var api_url = app.globalData.url + 'user';
                var key = 'myzy3224326de100671291c7d1a6353ff6db';
                var arr = [api_url, key, this.data.noncestr, timestamp];
                var str = '';
                for (let i in arr) {
                  str += arr[i];
                }
                // md5加密生成
                var password = '';
                password = util.hexMD5(str);
                password = password.toUpperCase();
                wx.request({
                  url: app.globalData.url + 'user',
                  method: 'GET',
                  header: {
                    "sign": password,
                    "timestamp": timestamp,
                    "noncestr": noncestr,
                    "uuid": uuid,
                    "token": token,
                    "expirytime": expiry_time,
                    "request_type": 1,
                    "logintype": 2
                  },
                  success: res => {
                    
                    if (res.data.code == 200) {
                      wx.setStorage({
                        key: 'content',
                        data: res.data
                      })
                      this.setData({
                        content:res.data
                      })

                    }
                    this.receiveGifts();
                  }
                })

              }
            }
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 动画 
    var attentionAnim = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      delay:0,
    })
    //设置循环动画
    this.attentionAnim =attentionAnim;
    var next = true;
    let ins =  setInterval(function () {
      if (next) {
        //根据需求实现相应的动画
        this.attentionAnim.opacity(0).step()
        next = !next;
      } else {
        this.attentionAnim.opacity(1).step()
        next = !next;
      }
      this.setData({
        //导出动画到指定控件animation属性
        attentionAnim: attentionAnim.export(),
      })
    }.bind(this),2000)
    
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var num = 0;
     let second = this.data.second
    let that = this
    let inters = setInterval(function(){
      if (num >= that.data.gift.length - 1) {
        num = 1;
      } else {
        num++;
      }
      that.setData({
        num: num
      })
    },4000)
    that.setData({
      inters: ''
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
    var uuid = this.data.uuid;
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
    }else if(uuid){
      var header = {
        "sign": password,
        "timestamp": timestamp,
        "noncestr": noncestr,
        "uuid": this.data.uuid,
        "token": this.data.token,
        "expirytime": this.data.expiry_time,
        "logintype": this.data.logintype
      }
      }else {
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