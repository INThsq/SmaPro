// pages/Bill/Bill.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res:'',
    money_bill:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let group = options.group;
    let ids = options.ids;
    if(group){
      this.setData({
        group:group,
        ids:ids
      })
      this.getBill(1,group,ids)
    }else{
      this.getBill(1,0,0);
      this.setData({
        group: 0,
        ids: 0
      })
    }
  },  
  move(e){
    console.log(e);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onPageScroll(e){
  },
  //获取账单详情
  getBill(now_page,bill_type_ids,bill_type_group){
   this.header(app.globalData.url+'getBillList'),
    wx.request({
      url:app.globalData.url+'getBillList',
      method: 'GET',
      data:{
        now_page:now_page,
        bill_type_ids:bill_type_ids,
        bill_type_group:bill_type_group
      },
      header:this.data.header,
      success: res => {
        if(res.data.code == 200){
          //时间戳转换
          var money_bills = res.data.data.content;
          for(let i = 0;i < money_bills.length; i++){
            for (let z = 0; z < money_bills[i].month_money_bill.money_bill.length ; z++){
              money_bills[i].month_money_bill.money_bill[z].create_time = utils.formatTime(money_bills[i].month_money_bill.money_bill[z].create_time, 'M-D h:m:s');
              money_bills[i].month_money_bill.money_bill[z].enter = money_bills[i].month_money_bill.enter_money_total;
              money_bills[i].month_money_bill.money_bill[z].out = money_bills[i].month_money_bill.out_money_total;

            }
          }
          this.setData({
            money_bill: money_bills,
            now_page:res.data.data.now_page
          })
          if (money_bills.length>0){
            this.setData({
              month: money_bills[0].month_money_bill.money_bill[0].month,
              enter: money_bills[0].month_money_bill.enter_money_total,
              out: money_bills[0].month_money_bill.out_money_total
            })
          }
        }else{
          utils.error(res);
        }
      }
    })
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
  //获取当前账单信息详情
  getDetail(e){
    var bill_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../BillDetail/BillDetail?id='+bill_id,
    })
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
  BindMove(e){
    let month = e.currentTarget.dataset.month;
    let money_bill = this.data.money_bill;
    let enter = e.currentTarget.dataset.enter;
    let out = e.currentTarget.dataset.out;
    this.setData({
      money_bill: money_bill,
      month:month,
      enter:enter,
      out:out
    })
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
    let group = this.data.group;
    let ids = this.data.ids;
    let page = this.data.now_page;
    page++;
    this.header(app.globalData.url + 'getBillList'),
      wx.request({
        url: app.globalData.url + 'getBillList',
        method: 'GET',
        data: {
          now_page: page,
          bill_type_ids: group,
          bill_type_group: ids
        },
        header: this.data.header,
        success: res => {
          if (res.data.code == 200) {
            //时间戳转换
            var list =  this.data.money_bill;
            var money_bills = res.data.data.content;
            for (let i = 0; i < money_bills.length; i++) {
              for (let z = 0; z < money_bills[i].month_money_bill.money_bill.length; z++) {
                money_bills[i].month_money_bill.money_bill[z].create_time = utils.formatTime(money_bills[i].month_money_bill.money_bill[z].create_time, 'M-D h:m:s');
                money_bills[i].month_money_bill.money_bill[z].enter = money_bills[i].month_money_bill.enter_money_total;
                money_bills[i].month_money_bill.money_bill[z].out = money_bills[i].month_money_bill.out_money_total;
                list[0].month_money_bill.money_bill.push(money_bills[i].month_money_bill.money_bill[z])

              }

            }
            this.setData({
              money_bill: list,
              now_page: res.data.data.now_page
            })
          }
        }
      })
  },
  //
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})