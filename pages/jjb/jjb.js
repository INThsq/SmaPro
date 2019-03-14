// pages/jjb.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'http://oss.myzy.com.cn/wechat/images/img_jj_8.png',
    check: 1,
    hide:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannels();
    // let data = JSON.parse(options.data);
    let data = wx.getStorageSync('datas')
    this.setData({
      data:data
    })
  },
  choose(e){
    let src = e.target.dataset.src;
    if (src == 'http://oss.myzy.com.cn/wechat/images/img_jj_8.png'){
      this.setData({
        url: "http://oss.myzy.com.cn/wechat/images/img_jj_7.png",
        check:0,
        hide:false
      })
    }else{
      this.setData({
        url: "http://oss.myzy.com.cn/wechat/images/img_jj_8.png",
        check:1,
        hide:true
      })
    }
  },
  detail: function (e) {
    let check = this.data.check;
    let id = e.currentTarget.dataset.id
    switch(check){
      case 0:
        wx.navigateTo({
          url: '../Details/Details?id=' + id,
        })
        app.get = 1;
        break;

        case 1:
        this.shows('请勾选权益说明后再进行购买');
        break;
    }
   
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