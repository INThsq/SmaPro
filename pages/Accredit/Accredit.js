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
    Authorize: true,
    latitude:'',
    longitude:''
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
  
  getLocation: function (userInfo, recInfo, dot_num) {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success(re) {
        var latitude = re.latitude;
        var longitude = re.longitude;
        that.wxLogin(userInfo,recInfo,latitude,longitude,dot_num)
      },
      fail(re) {
        var latitude = '';
        var longitude = '';
        that.wxLogin(userInfo, recInfo, latitude, longitude, dot_num)
      }

    })
  },

  //获取授权信息
  bindGetUserInfo: function (e) {
    
    var dot_num = this.data.dot_num;
    var recInfo = this.data.recInfo;
    
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
    userInfo.referee_id = referee_id;
    if (e.detail.userInfo) {
      this.getLocation(userInfo, recInfo,dot_num);
      

    } else {
      this.setData({
        isShow: false
      });
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
        app.state = 2;

      }, 1500);
    }
    
  },
  wxLogin(userInfo, recInfo, latitude, longitude,dot_num){
    wx.login({
      success: res => {
        this.setData({
          isShow: true
        })
        var code = res.code;
        userInfo.code = code;
        userInfo.latitude = latitude;
        userInfo.longitude = longitude;
        console.log(latitude)
        if (recInfo.number) {
          var data = {
            login_type: 2,
            client_type: 3,
            client_version: '1.0.0',
            oauth_data: JSON.stringify(userInfo),
            referee_data: JSON.stringify(recInfo)
          }

        } else {
          var data = {
            login_type: 2,
            client_type: 3,
            client_version: '1.0.0',
            oauth_data: JSON.stringify(userInfo)
          }

        }
        wx.request({
          url: app.globalData.url + 'wxLogin',
          method: 'POST',
          header: app.globalData.header,
          data: data,
          success: res => {

            //返回值为401的情况下  未授权  跳转授权页面
            if (res.data.code == 401) {
              this.setData({
                isShow: false

              })
              // var res = res.data.data;
              this.shows(res.data.msg)
              wx.switchTab({
                url: '../userCenter/userCenter',
              })
            } else if (res.data.code == 200) {

              app.token = res.data.data.token;
              //已登录情况下为2  后台获取到的信息渲染到页面上
              //生成header
              var uuid = res.data.data.uuid;
              var token = res.data.data.token;
              var expiry_time = res.data.data.expiry_time;
              //本地存储
              wx.setStorageSync('uuid', uuid);
              wx.setStorageSync('token', token);
              wx.setStorageSync('openid', res.data.data.member_oauth.openid);

              wx.getStorageSync('expiry_time', expiry_time);
              wx.setStorageSync('member_mall', res.data.data.member_mall);
              wx.setStorageSync('session_id', 'PHPSESSID=' + res.data.data.session_id +'; path=/; HttpOnly');
              app.session_id = 'PHPSESSID=' +res.data.data.session_id +'; path=/; HttpOnly';
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
                    if (dot_num) {
                      setTimeout(function () {
                        app.scene = 0;
                        wx.navigateTo({
                          url: '../Query/Query?dot_num=' + dot_num
                        })
                        wx.setStorageSync('text', '登录成功')
                      }, 1500)
                    } else {

                      setTimeout(function () {
                        wx.switchTab({
                          url: '../index/index',
                        })
                        wx.setStorageSync('text', '登录成功')
                      }, 1500)

                    }

                    this.setData({
                      isShow: true
                    })
                  } else {

                    this.shows(res.data.msg);
                    this.setData({
                      isShow: false

                    })
                  }


                }
              })

            }
          }
        })
      }
    })
  },
  //发送模板消息
  /**
   * 触发微信提醒
   */
 
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let Tname = app.globalData.Tname;
    this.setData({
      Tname: Tname
    })
    if (options.dot_num){
      this.setData({
        dot_num: options.dot_num
      })
    }
    if(options.q){
      let qrUrl = decodeURIComponent(options.q);
      let index = qrUrl.lastIndexOf('=');
      qrUrl = qrUrl.substring(index+1,qrUrl.length);
      // qrUrl = JSON.parse(qrUrl);
      var referee_data = qrUrl;
      wx.login({
        success: res => {
          var code = res.code
          this.wxAuthorize(code, referee_data)
        }
      })
    }else{
      wx.login({
        success: res => {
          var code = res.code
          this.wxAuthorize(code, '')
        }
      })
    }

    new app.ToastPannels();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },
  //授权推荐
  wxAuthorize(auth_code, referee_data){
    this.header(app.globalData.url +'wxAuthorize');
    wx.request({
      url: app.globalData.url +'wxAuthorize',
      header:this.data.header,
      method:'POST',
      data:{
        auth_code:auth_code,
        referee_data:referee_data
      },
      success:res=>{
        if(res.data.code == 200){
          this.setData({
            recInfo:res.data.data.callback
          })
          wx.removeStorage({
            key: 'codes',
          })
        }else{
          this.shows(res.data.msg)
        }
       
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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