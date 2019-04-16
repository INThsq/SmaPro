// pages/Info/Info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname:'',
    imgurl:'',
    sex:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var content = wx.getStorageSync('content');
    var nickname = content.data.content.userinfo.member_oauth[0].nickname;
    var imgurl = content.data.content.userinfo.member_oauth[0].headimgurl;
    var sex = content.data.content.userinfo.member_oauth[0].sex;
    switch(sex){
      case 1:
      this.setData({
        sex:"男"
      })
      break;
      case 2:
      this.setData({
        sex:'女'
      })
      break;
    }
    this.setData({
      nickname: nickname,
      imgurl: imgurl
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
  //打开生成二维码
  openCode(){
    wx.navigateTo({
      url: '../getCode/getCode',
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