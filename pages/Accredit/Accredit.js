// pages/Accredit/Accredit.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 0,
    avatarUrl: '',
    nickName: '',
    userInfo: '',
    noncestr: '',
    code: '',
    //loading显示与隐藏
    onOff: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    member_mall: '',
    recInfo: '',
    hide: false,
    Authorize: true

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
      var header = {
        "sign": password,
        "timestamp": timestamp,
        "noncestr": noncestr,
        "uuid": uuid,
        "token": token,
        "expirytime": expiry_time,
        "login_type": 2
      }
    } else {
      var header = {
        "sign": password,
        "timestamp": timestamp,
        "noncestr": noncestr,
        "uuid": '',
        "token": '',
        "expirytime": '',
        "login_type": 2
      }
    }



    this.setData({
      header: header
    })
  },
  //获取授权信息
  bindGetUserInfo: function (e) {
    getApp().globalData.userInfo = e.detail;
    wx.setStorageSync('userInfo', e.detail);
    var referee_id = '';
    if (this.data.recInfo.referee_id) {
      referee_id = this.data.recInfo.referee_id
    } else {
      referee_id = ''
    }
    this.setData({
      userInfo: e.detail.userInfo
    })
    var userInfo = e.detail;
    // userInfo.code =  getApp().globalData.code;

    userInfo.referee_id = referee_id;
    if (e.detail.userInfo) {
      wx.login({
        success: res => {
          this.setData({
            hide: false
          })
          // this.setData({
          //   code:res.code
          // })
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
                this.setData({
                  hide: true
                })
                // var res = res.data.data;
                this.shows(res.data.msg)
                wx.switchTab({
                  url: '../userCenter/userCenter',
                })
              } else if (res.data.code == 200) {
                //已登录情况下为2  后台获取到的信息渲染到页面上
                //生成header
                var uuid = res.data.data.uuid;
                var token = res.data.data.token;
                var expiry_time = res.data.data.expiry_time;
                //本地存储
                wx.setStorageSync('uuid', uuid);
                wx.setStorageSync('token', token);
                wx.getStorageSync('expiry_time', expiry_time);
                wx.setStorageSync('member_mall', res.data.data.member_mall);

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
                      setTimeout(function () {
                        wx.switchTab({
                          url: '../index/index',
                        })
                        wx.setStorageSync('text', '登录成功')
                      }, 1500)
                      this.setData({
                        hide: false
                      })
                    } else {
                        
                      this.shows(res.data.msg);
                          this.setData({
                            hide:true
                          })
                    }


                  }
                })

              }
            }
          })
        }
      })
    } else {
      this.setData({
        hide: true
      });
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
        app.state = 2;

      }, 1500);
    }
  },
  //获取推荐授权
  wxAuthorize(unionid, code) {
    var that = this;
    that.header(app.globalData.url + 'wxAuthorize');
    wx.request({
      url: app.globalData.url + 'wxAuthorize',
      method: 'POST',
      header: that.data.header,
      data: {
        unionid: 'o8Vin1LnB282t-JodFHJApuKlbFo',
        auth_code: code,
        login_type: '2'
      },
      success: res => {
        if (res.data.code == 200) {
          that.setData({
            recInfo: res.data.data
          })
        } else {
          this.shows(res.data.msg)
          this.setData({
            Authorize: false
          })

        }
      }
    })
  },
  //发送模板消息
  /**
   * 触发微信提醒
   */
  formSubmit: function (e) {
    console.log(e)
    var formid = e.detail.formSubmit;
    wx.setStorageSync('formid', formid);
  },
  
  bindGetUserInfos: function (e) {
    this.header(app.globalData.url + 'wxTplMessageTest');
    getApp().globalData.userInfo = e.detail;
    wx.setStorageSync('userInfo', e.detail);
    var referee_unionid = '';
    if (this.data.recInfo.referee_unionid !== '') {
      referee_unionid = this.data.recInfo.referee_unionid
    }
    this.setData({
      userInfo: e.detail.userInfo
    })
    var userInfo = e.detail;
    var formid = wx.getStorageSync('formid');
    userInfo.code = getApp().globalData.code;
    userInfo.referee_unionid = referee_unionid;
    userInfo.formid = formid;
    if (e.detail.userInfo) {
      wx.login({
        success: res => {
          this.setData({
            code: res.code
          })
          var code = getApp().globalData.code;
          wx.request({
            url: app.globalData.url + 'wxTplMessageTest',
            method: 'POST',
            header: this.data.header,
            data: {
              login_type: 1,
              client_type: 3,
              client_version: '1.0.0',
              // code:code,
              oauth_data: JSON.stringify(userInfo)
            },
            success: res => {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })

            }
          })
        }
      })
    } else {

      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
        app.state = 2;

      }, 1500);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this

    //地址有参
    let unionid = 'o0dfU1Is3kvvWY1j7t4duHbozu0o';
    if (unionid) {
      let that = this
      wx.login({
        success: res => {
          // wx.setStorageSync('code',res.code)
          this.wxAuthorize(unionid, res.code)
        }
      })
    }
    new app.ToastPannel();

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

    // this.bindGetUserInfo();
    //
    if (this.data.Authorize) {
      this.setData({
        hide: true
      })
    } else {
      this.wxAuthorize();
    }
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })

    this.animation = animation

    // animation.scale(2, 2).rotate(45).step()

    this.setData({
      animationData: animation.export()
    })
    var n = 0;
    //连续动画需要添加定时器,所传参数每次+1就行
    setInterval(function () {
      n = n + 1;
      this.animation.rotate(10 * (n)).step()
      this.setData({
        animationData: this.animation.export()
      })
    }.bind(this), 40)
  },


  //返回首页
  back: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  //获取用户信息接口


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

  }
})