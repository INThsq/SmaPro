// pages/jjb.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'http://oss.myzy.com.cn/wechat/images/img_jj_8.png',
    check: 1,
    hide:true,
    show:true,
    video:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannels();
    if(options.data){
      let data = JSON.parse(options.data);
      this.setData({
        data: data
      })
    }
  },
  //播放视频
  playvedio: function (e) {
    let vediocon = wx.createVideoContext("myvedio", this)
    vediocon.play()
    this.setData({
      show: false,
      video:false
    })
  },
  /*
      *视频播放完毕重新上封面
      */
     endvedio: function () {
      let vediocon = wx.createVideoContext("myvedio", this)
      // vediocon.play()
      console.log(vediocon)
      this.setData({
        show: true,
        video:true
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
  //返回上一页
  back(){
    console.log('eee');
    this.setData({
      hide:true
    })
      wx.navigateBack({
        delta:1
      })
  },
  //跳转协议
  Equit(e){
    let src = e.currentTarget.dataset.src;
    wx.navigateTo({
      url: '../Webview/Webview?h5='+src,
    })
  },
  swiperTab(){
    this.setData({
        video:true
    })

  },
  detail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../Details/Details?id=' + id,
    })
  },
  details: function (e) {
    let check = this.data.check;
    let id = e.currentTarget.dataset.id
    var content = wx.getStorageSync('content');

    switch(check){

      case 0:
        if (content) {
          wx.navigateTo({
            url: '../Details/Details?id=' + id,
          })
          app.get = 1;
        } else {
          wx.navigateTo({
            url: '../Accredit/Accredit',
          })
        }
        break;

        case 1:
        if(content){
          this.shows('请勾选权益说明后再进行购买');
        }else{
          wx.navigateTo({
            url: '../Accredit/Accredit',
          })
        }
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