
var util = require('../../utils/md5.js');
var app = getApp();
var utils = require('../../utils/util.js');
// pages/Earn/Ear.js
Page({

  data: {
    currentTab: 0,
    header:"",
    noncestr:'',
    fansTotal:'',
    fansList:'',
    histroy: true,
    del: true,
    One: false
  },
  /**
   * 页面的初始数据
   */
  //判断删除符号
  keyword(e) {
    let val = e.detail.value;
    if (val.length > 0) {
      this.setData({
        del: false
      })
    } else {
      this.setData({
        del: true,
        One: false,
        conts: true
      })
    }

    if (val.length > 20) {
      this.show('您输入的内容太长,建议在20字以内哦~')
    }
  },
  //判断删除符号
  keyword(e) {
    let val = e.detail.value;
    if (val.length > 0) {
      this.setData({
        del: false
      })
    } else {
      this.setData({
        del: true,
        One: false,
        conts: true
      })
    }
    if (val.length > 20) {
      this.shows('您输入的内容太长,建议在20字以内哦~')
    }else{
      this.setData({
        keywords:val
      })
      // this.fansList(1,1,val)
    }
  },
  searchSubmitFn(){
    let keywords = this.data.keywords;
    this.fansList(1,1,keywords)
  },
  //删除字段
  del() {
    this.setData({
      keywords: '',
      
      del: true,
      One: false,
      conts: true
    })
    this.fansList(1, 1, '')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannels();
    this.fansTotal();
    this.fansList(1,1,'');
  },

  //点击切换
  clickTab: function (e) {
    var type = e.currentTarget.dataset.type;
      this.setData({
        type:type,
        currentTab:e.currentTarget.dataset.current
      })
    this.fansList(type, 1);
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

 

 

  //跳转粉丝订单
  Fanorder() {
    wx.navigateTo({
      url: '../Fanorder/Fanorder',
    })
  },
  //获取粉丝
  fansTotal() {
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url+'fansTotal');
    wx.request({
      url: app.globalData.url + 'fansTotal',
      method: 'GET',
      header: this.data.header,
      success: res => {
        this.setData({
          isShow:false
        })
        if (res.data.code == 200) {
          this.setData({
            fansTotal: res.data.data.callback
          })
        }else{
          utils.error(res);
        }
      }
    })
  },
  //获取粉丝订单
  fansList(param_type, now_page,keywords){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url + 'fansList');
    wx.request({
      url: app.globalData.url + 'fansList',
      method: 'GET',
      header: this.data.header,
      data: {
        param_type: param_type,
        now_page: now_page,
        keywords:keywords
      },
      success: res => {
        this.setData({
          isShow:false
        })
        if (res.data.code == 200) {
          
          for(let r=0;r<res.data.data.callback.fans_list.length;r++){
                if(res.data.data.callback.fans_list.length >= 15){
                  this.setData({
                    up:"下拉加载更多~"
                  })
                }else{
                  this.setData({
                    up:"暂时没有更多内容了~"
                  })
                }
                res.data.data.callback.fans_list[r].create_time = utils.formatTime(res.data.data.callback.fans_list[r].create_time, 'Y-M-D h:m:s')
          }
          this.setData({
            page: res.data.data.callback.now_page,
            fansList: res.data.data.callback.fans_list
          })
        }else{
          utils.error(res);
        }
      }
    })
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      let page = this.data.page;
      let param_type = this.data.type;
      let fansList = this.data.fansList;
      let keywords = this.data.keywords;
      if(fansList.length <15){
        wx.stopPullDownRefresh();
        this.setData({
          up:'暂时没有更多内容了~'
        })
      }else{
        page ++;
        this.header(app.globalData.url + 'fansList');
        wx.request({
          url: app.globalData.url + 'fansList',
          method: 'GET',
          header: this.data.header,
          data: {
            param_type: param_type,
            now_page:page,
            keywords:keywords
          },
          success: res => {
            this.setData({
              isShow: false
            })
        if (res.data.code == 200) {

          for (let r = 0; r < res.data.data.callback.fans_list.length; r++) {
            if (res.data.data.callback.fans_list.length >= 15) {
              this.setData({
                up: "下拉加载更多~"
              })
            } else {
              this.setData({
                up: "暂时没有更多内容了~"
              })
            }
            res.data.data.callback.fans_list[r].create_time = utils.formatTime(res.data.data.callback.fans_list[r].create_time, 'Y-M-D h:m:s')
            fansList.push(res.data.data.callback.fans_list[r])
          }
          this.setData({
            page: res.data.data.callback.now_page,
            fansList: fansList
          })
        }
      }
    })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }




})