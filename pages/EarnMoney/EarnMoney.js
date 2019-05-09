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
      height: 352, 
      flag:false,
      attentionAnim:'',
      top:'',
      second:6,
      num:1,
      gets:0,
      text:'立即领取(包邮)',
      obj : [ ],
      isShow:false,
      code:200,
    buttonClicked:true,
    latitude:'',
    longitude:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */

  getLocation: function (gift_queue_id, queue_num, userInfo, referee_data) {
    let that = this;
    that.setData({
      buttonClicked: false
    })
    wx.getLocation({
      type: 'gcj02',
      success(re) {
        var latitude = re.latitude;
        var longitude = re.longitude;
        that.wxLogin(gift_queue_id, queue_num, userInfo, referee_data, latitude, longitude);
        that.setData({
          isShow: false
        })
      },
      fail(re) {
        var latitude = '';
        var longitude = '';
        that.wxLogin(gift_queue_id, queue_num, userInfo, referee_data, latitude, longitude)
        that.setData({
          isShow:false
        })
      }

    })
  },
  GoIndex(){
    wx.switchTab({
      url:'../index/index'
    })
  },
  onLoad: function (options) {
     new app.ToastPannels();
    let content = wx.getStorageSync('content');
    let scene = app.globalData.scene;
    this.setData({
      content: content,
      Tname:app.globalData.Tname
    })
    if (options.q) {
      let qrUrl = decodeURIComponent(options.q);
      var  gift_queue_id = utils.getQueryString(qrUrl, 'gift_queue_id');
      this.setData({
        gift_queue_id:gift_queue_id
      })
    }
    else{
        var gift_queue_id = options.gift_queue_id;
            this.setData({
              gift_queue_id: gift_queue_id
          })
    }
   

    // //有场景显示
    if (scene == 1036 || scene == 1037 || scene == 1011 || scene == 1008 || scene == 1007) {
      this.getGifts(gift_queue_id)
    }else{
      this.setData({
        scene:scene
      })
    }
  },
  //赠送商家入驻
  activity(member_mall_id) {
    this.header(app.globalData.url + 'activity');
    wx.request({
      url: app.globalData.url + 'activity',
      method: 'get',
      data: {
        member_mall_id: member_mall_id
      },
      header: this.data.header,
      success: res => {
        if (res.data.code == 200) {
          let type = res.data.data.callback.type;
          switch (type) {
            case 0:
              app.scenes = 1;
              wx.setStorageSync('datas', res.data.data.callback)
              wx.navigateTo({
                url: '../jjb/jjb?data=' + JSON.stringify(res.data.data.callback),
              })
              break;
            case 1:
              this.distribution('')
              app.scenes = 0;
              break;
          }
        } else {
          this.show(res.data.code)
        }
      }
    })
  },
  // 跳转
  goStart(e){
    let key = e.target.dataset.text;
        this.activity(key)
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
  getGifts(gift_queue_id){
    this.setData({
      isShow:true
    })
    let that = this
    that.header(app.globalData.url +'getGifts')
    wx.request({
      url: app.globalData.url +'getGifts',
      method:'post',
      header:that.data.header,
      data:{
        gift_queue_id: gift_queue_id,
      },
      success:res=>{
        this.setData({
            code:res.data.code,
            isShow:false
        })
        if(res.data.code == 200){
          if (res.data.data.callback.receive_gifts_status ==1){
            that.setData({
              gets:0
            })
          } else if (res.data.data.callback.receive_gifts_status == 2){
              this.setData({
                content:'3'
              })
            }else{
            this.setData({
              gets:1
            })
          }
          that.setData({
            getGifts: res.data.data.callback,
            obj: res.data.data.callback.gift_praise,
            queue_num: res.data.data.callback.get_gifts.queue_num,
            money:Number(res.data.data.callback.gift_money_total),
            referee_data: res.data.data.callback.referee_data,
            ['getGifts.receive_gifts_status']: res.data.data.callback.receive_gifts_status,
            buttonClicked:true
          })
        }
          else if(res.data.code == 402){
              wx.navigateTo({
                url: '../Startgroup/Startgroup?id=' + res.data.data.callback.mall_goods_id + '&type=1'
              })
          }else{
          this.setData({
            buttonClicked: true
          })
             this.shows(res.data.msg);
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
  receiveGift(gift_queue_id, queue_num){
    this.setData({
      isShow:true,
      buttonClicked:false
    })
    let that = this
    let money = that.data.money
    that.header(app.globalData.url + 'receiveGifts')
    wx.request({
      url: app.globalData.url + 'receiveGifts',
      method: 'post',
      header: that.data.header,
      data: {
        gift_queue_id: gift_queue_id,
        queue_num: queue_num
      },
      success: res => {
        that.setData({
          isShow:false
        })
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg
          })
          let member_oauth = res.data.data.callback.member_oauth;
          member_oauth.allot_money = res.data.data.callback.gift_praise.reward_money
          let obj = that.data.obj;
          money = (Number(money)+Number(res.data.data.callback.gift_praise.reward_money)).toFixed(2);
          obj.unshift(member_oauth)
          that.setData({
            button_text: res.data.data.callback.gift_praise.button_text,
            reward_money: res.data.data.callback.gift_praise.reward_money,
            obj:obj,
            gets:0,
            let:1,
            ['getGifts.gift_money_total']:money
          })
          } else if (res.data.code == 402) {
          wx.navigateTo({
            url: '../Startgroup/Startgroup?id=' + res.data.data.callback.mall_goods_id,
          })
        }else if(res.data.code == 401){
          this.shows(res.data.msg);
          this.setData({
            ['getGifts.receive_gifts_status']:2,
            cont:2,
            button_text:res.data.msg
          })
        }else{
            this.shows(res.data.msg),
            wx.removeStorageSync('content');
            let userInfo = wx.getStorageSync('userInfo');
            var referee_data = this.data.referee_data;

          this.getLocation(gift_queue_id,queue_num,userInfo,referee_data)
            
        }
      }
    })
  },
  //点击领取
  receiveGifts(e){
    let receive_gifts_status = this.data.getGifts.receive_gifts_status
    let gift_queue_id = this.data.gift_queue_id
    let queue_num = this.data.queue_num
    let gets = this.data.gets
    let content = wx.getStorageSync('content')
    if (gets!=1&&content) {
      wx.navigateTo({
        url: '../Notgifts/Notgifts',
      })
    }else{
      switch (receive_gifts_status) {
        case 0:
          this.receiveGift(gift_queue_id,queue_num)
          break;
      } 
    }

   
  },

  //获取授权信息
  bindGetUserInfo: function (e) {    
    var referee_data = this.data.referee_data
    var gift_queue_id = this.data.gift_queue_id
    var queue_num = this.data.queue_num
    let text = e.currentTarget.dataset.type
    let state = this.data.let

    this.setData({
      userInfo: e.detail.userInfo,
      isShow:true
    })
    var userInfo = e.detail;
    wx.setStorageSync('userInfo', e.detail);
    var buttonClicked = this.data.buttonClicked;
    setTimeout(()=>{
        if(state == 1){
          wx.navigateTo({
            url: '../Notgifts/Notgifts',
          })
        }else{
          if (buttonClicked){
            this.getLocation(gift_queue_id, queue_num, userInfo, referee_data)

          }
        }
    }, 2000)

     
  },

    //登录信息
  wxLogin(gift_queue_id, queue_num, userInfo, referee_data, latitude, longitude){
    this.setData({
      buttonClicked:false
    })
    wx.login({
      success: res => {
        var code = res.code;
        userInfo.code = code;
        userInfo.latitude = latitude;
        userInfo.longitude = longitude;
        wx.request({
          url: app.globalData.url + 'wxLogin',
          method: 'POST',
          header: app.globalData.header,
          data: {
            login_type: 2,
            client_type: 3,
            client_version: '1.0.0',
            oauth_data: JSON.stringify(userInfo),
            referee_data: JSON.stringify(referee_data)
          },
          success: res => {
           
            //返回值为401的情况下  未授权  跳转授权页面
            if (res.data.code == 401) {
              this.setData({
                isShow: false

              })
              wx.removeStorageSync('content')
              this.shows(res.data.msg)
              this.setData({
                buttonClicked:true
              })
            } else if (res.data.code == 200) {
              this.setData({
                isShow: true

              })
              wx.setStorageSync('session_id', 'PHPSESSID=' + res.data.data.session_id + '; path=/; HttpOnly');
              app.session_id = 'PHPSESSID=' + res.data.data.session_id + '; path=/; HttpOnly';
              this.setData({
                uuid: res.data.data.uuid,
                token: res.data.data.token,
                expiry_time: res.data.data.expiry_time,
                logintype: res.data.data.expiry_time,
                buttonClicked:false
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
                    wx.setStorageSync('bg', res.data.data.content.background)

        
                    wx.setStorage({
                      key: 'content',
                      data: res.data
                    })
                    this.setData({
                      content: res.data,
                      cont: 2
                    })

                  }
                  this.getGifts(gift_queue_id)
                  if(this.data.code != 402){
                  this.receiveGift(gift_queue_id, queue_num)
                  }
                }
              })

            }
          }
        })

      }
    })
       
    
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