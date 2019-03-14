// pages/Near/Near.js
var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: '4IOBZ-P77KI-DFEG5-5JCRB-FTFGQ-RAFIY' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
        latitude:'',
        longitude:'',
        del:true,

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserLocation();
    new app.ToastPannel();
    // wx.showModal({
    //   content:'您所在的城市北京暂无消息'
    // })
  },    

  //获取input 内值
  keyword(e) {
    let val = e.detail.value;
    if (val.length > 0) {
      this.setData({
        del: false,
        searchValue:val
      })
    } else {
      this.setData({
        del: true,
      })
    }
    if (val.length > 12) {
      this.show('您输入的内容太长,建议在20字以内哦~')
    }
  },
  //删除
  del(){
      this.setData({
        searchValue:'',
        del:true
      })
  },
  //选择位置位置
  chooseLocation: function (e) {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        // success
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  calling(){
    wx.makePhoneCall({
      phoneNumber: '11322222', //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.Modal = this.selectComponent("#modal");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },
  //位置授权
  getUserLocation(){
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API

                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
        }
        else {
          this.getLocation();
          //调用wx.getLocation的API
        }
      }
    })
  },
  //微信获取经纬度
  getLocation: function () {
    var vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  //获取当前地理位置
  getLocal(latitude,longitude){
    qqmapsdk.reverseGeocoder({
      location:{
        latitude:latitude,
        longitude: longitude
      },
      success:(res)=>{
        let province = res.result.address_component.province;
        province = province.replace('市','');
        this.setData({
          province:province
        })
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})