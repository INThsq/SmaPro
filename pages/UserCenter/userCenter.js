//index.js
//获取应用实例
var app = getApp()
Page({
  

  //收益列表跳转事件
  navCour: function () {
    wx.navigateTo({
      url: '../Earn/Earning',
    })
  },
  // 粉丝订单跳转
  fanOrder:function(){
    wx.navigateTo({
      url: '../Fanorder/Fanorder',
    })
  },
  //天天抢钱
  Ronmoney() {
    wx.navigateTo({
      url: '../Robmoney/Robmoney',
    })
  },
  //我的订单跳转事件
  myOrder:function(){
    wx.navigateTo({
      url: '../Order/Order?state=0',
    })
  },
  // 跳转状态事件
  gettab: function (e) {
    app.tab = e.currentTarget.id;
    wx.navigateTo({
      url: '../Order/Order',
    })
  },
  //跳转余额提现状态
  toBalance:function(){
    wx.navigateTo({
      url: '../Balance/Balance',
    })
  },
  //关于我们跳转
  aboutUs:function(){
    wx.navigateTo({
      url: '../Aboutus/Aboutus',
    })
  },
  //粉丝跳转
  FenNum:function(){
    wx.navigateTo({
      url: '../FenNum/FenNum',
    })
  },
  //收货地址跳转
  adress: function () {
    wx.navigateTo({
      url: '../Address/Address',
    })
  },
  onLoad: function () {

  
  },
  


  onReady: function () {
    
    var attentionAnim = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      delay: 0
    })
    //设置循环动画
    this.attentionAnim = attentionAnim
    var next = true;
    setInterval(function () {
      if (next) {
        //根据需求实现相应的动画
        this.attentionAnim.translate(0,4).step()
        next = !next;
      } else {
        this.attentionAnim.translate(0,2).step()
        next = !next;
      }
      this.setData({
        //导出动画到指定控件animation属性
        attentionAnim: attentionAnim.export()
      })
    }.bind(this), 1200)

  },
  onShow: function () {

    // 生命周期函数--监听页面显示


  },

})
