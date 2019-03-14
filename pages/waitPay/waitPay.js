// pages/waitPay/waitPay.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hour:'00',
    minutes:'00',
    seconds:'00',
    mill:'00',
    countDownDay: '00',
    countDownHour: '00',
    countDownMinute: '00',
    countDownSecond: '00',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    new app.ToastPannel();
    let Waitpay = JSON.parse(options.callback);
    var totalPrice = wx.setStorageSync('totalPrice', Waitpay.callback.total_price);
    var discount_money = wx.setStorageSync('discount_money', Waitpay.callback.discount_price);
    var price = wx.setStorageSync('price', Waitpay.callback.price);
    var discount_price = wx.setStorageSync('discount_money', Waitpay.callback.discount_price);
    Waitpay.callback.create_time= utils.formatTime(Waitpay.callback.create_time, 'Y-M-D h:m:s');
    this.time(Waitpay.callback.order_queue.expire_time)
   switch(Waitpay.callback.pay_type){
     case 1:
     Waitpay.callback.pay_type = '余额支付';
     break;
     case 2:
     Waitpay.callback.pay_type = '微信支付';
     break;
     case 3:
     Waitpay.callback.pay_type = '微信支付';
     break;
     case 4:
     Waitpay.callback.pay_type = '支付宝支付';
     break;
   }
   
    let status = Waitpay.callback.order_queue.status;
    switch(status){
      case 0:
        Waitpay.callback.order_queue.status = '待付款';
        break;
      case 2:
        Waitpay.callback.order_queue.status = '已付款';
        break;
      case 4:
        Waitpay.callback.order_queue.status = '待收货';
        break;
      case 6:
        Waitpay.callback.order_queue.status = '待评价';
        break;
      case 8 :
        Waitpay.callback.order_queue.status = '已完成';
        break;  
      case 9:
        Waitpay.callback.order_queue.status = '已失效';
        break; 
    }
    let zuli = getApp().zuli;
    this.setData({
      Waitpay: Waitpay,
      zuli: zuli
    })
  },
  //跳转详情
  detail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../Details/Details?id='+id,
    })
  },
  //拨打电话
  call(){
    let phone = this.data.phone;
    wx.makePhoneCall({
      phoneNumber:phone,
      success:function(){
      },
      fail:function(){
      }
    })
  },
  //
  toConfirm(e){
    let order_num = e.currentTarget.dataset.id;
    this.getWaitPay(order_num);
  },
  //
  check(e){
    let order_num =e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../Logistics/logistics?id='+order_num,
    })
  },
  // 返回上一页
  back: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.Modal = this.selectComponent("#modal");
  },
  Canel(e){
    let order_num =e.currentTarget.dataset.id;
    this.setData({
      order_num:order_num
    })
    this.Modal.showModal();
  },
  _confirmEventFirst: function(){
    this.Modal.hideModal();
    let order_num = this.data.order_num;
    this.invalidOrder(order_num)
  },
  _cancelEvent: function () {
  },
 //取消订单
 invalidOrder(order_num){
  this.header(app.globalData.url + 'invalidOrder');
  let detail = this.data.listData;
  wx.request({
    url: app.globalData.url + 'invalidOrder',
    header: this.data.header,
    method: 'post',
    data: {
      order_num: order_num
    },
    success: res => {
      if (res.data.code == 200) {
        this.show('取消成功');
        wx.navigateTo({
          url:'../Order/Order'
        })
      } else {
        utils.error(res);
      }
    }
  })
 },
  // 去支付
getWaitPay(order_num){
    this.header(app.globalData.url +'getWaitPay');
    wx.request({
      url: app.globalData.url + 'getWaitPay',
      method:'get',
      header:this.data.header,
      data:{
        order_num: order_num
      },
      success:res=>{
        wx.setStorageSync('details', res.data.data.callback);
        wx.setStorageSync('discount_money', res.data.data.callback.discount_money);
        app.types=1;
        wx.navigateTo({
          url: '../Confirm/Confirm?types=1',
        })
      }

    })
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

  },
   //倒计时
   time(t) {
    var timer = setInterval(function () {
      var totalSecond = t - Date.parse(new Date()) / 1000;
      // 秒数
      var second = totalSecond;

      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownDay: dayStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(timer);
        this.setData({
          countDownDay: '00',
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });
      }
    }.bind(this),1000)
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
      var header = {
        "sign": password,
        "timestamp": timestamp,
        "noncestr": noncestr,
        "uuid": uuid,
        "token": token,
        "expirytime": expiry_time,
        "logintype": logintype
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
