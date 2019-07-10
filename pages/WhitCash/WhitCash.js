// pages/WhitCash/WhitCash.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js'); 
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let content = wx.getStorageSync('content');
    let type = options.type;

    if(type){
      type = type
      this.setData({
        type:type
      })
    }else{
      type = 0
      this.setData({
        type:0
      })
    }
    
    if(content){
    this.capitalDetail(type);
    }else{
      wx.navigateTo({
        url:'../Accredit/Accredit'
      })
    }
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
    //提现跳转
    Deposit: function (e) {
      let content = wx.getStorageSync('content');
      if (content) {
        var callback = this.data.callback.application;
        let jump = callback[0].jump;
        if(callback.length == 1){
          wx.navigateTo({
            url: '../Deposit/Deposit?jump='+jump,
          })
        }else{
          this.setData({
            showModalStatus:true
          });
        }
      } else {
        wx.navigateTo({
          url: '../Accredit/Accredit',
        })
      }
    },
    //可结算跳转
    Bill(e){
      console.log(e)
      let group = e.currentTarget.dataset.group;
      let ids = e.currentTarget.dataset.ids;
      wx.navigateTo({
        url:'../Bill/Bill?group='+group+'&ids='+ids
      })
    },
    Choose(e){
      this.setData({
        showModalStatus:false
      })
      let jump = e.currentTarget.dataset.jump;
      wx.navigateTo({
        url: '../Deposit/Deposit?jump=' + jump,
      })
    },
     
  //  资金明细
  capitalDetail(scene_type){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url+'capitalDetail');
    wx.request({
      url: app.globalData.url + 'capitalDetail',
      method: 'GET',
      header: this.data.header,
      data:{
          scene_type:scene_type
      },
      success:res=>{
        this.setData({
          isShow:false
        })
       if(res.data.code == 200){
         this.setData({
          callback:res.data.data.callback
         })
       }else{
        utils.error(res);
       }
      }
    })

















  },
   back(){
     wx.navigateBack({
       delta:1
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
  })