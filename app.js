//app.js
App({
  data: {
    // state:0

  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  onShow: function () {
    // if(state == 0){
    //   wx.navigateTo({
    //     url: '../Accredit/Accredit',
    //   })
    // }
  },

  //改变地址状态的值
  changeAddressStart(type) {
    this.globalData.addressStart = type;
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    addressStart: 1,//1新增,2编辑
  }
})
