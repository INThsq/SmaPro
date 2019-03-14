// pages/Logistics/logistics.js
var util = require('../../utils/md5.js')
var utils = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:'',
    statics:0,
     logs:{
    "resultcode": "200", /* 老版状态码，新用户请忽略此字段 */
    "reason": "查询物流信息成功",
    "result": {
      "company": "顺丰快递", /* 快递公司名字 */
      "com": "ems",
      "comtel":'1760078408',
      "no": "1186465887499", /* 快递单号 */
      "status": "1", /* 1表示此快递单的物流信息不会发生变化，此时您可缓存下来；0表示有变化的可能性 */
      "list": [
        {
          "datetime": "2016-06-15 21:44:04",  /* 物流事件发生的时间 */
          "remark": "离开郴州市 发往长沙市【郴州市】", /* 物流事件的描述 */
          "zone": "" /* 快件当时所在区域，由于快递公司升级，现大多数快递不提供此信息 */
        },
      
        {
          "datetime": "2016-06-15 21:46:45",
          "remark": "郴州市邮政速递物流公司国际快件监管中心已收件（揽投员姓名：侯云,联系电话:）【郴州市】",
          "zone": ""
        },
        {
          "datetime": "2016-06-16 12:04:00",
          "remark": "离开长沙市 发往贵阳市（经转）【长沙市】",
          "zone": ""
        },
        {
          "datetime": "2016-06-17 07:53:00",
          "remark": "到达贵阳市处理中心（经转）【贵阳市】",
          "zone": ""
        },
        {
          "datetime": "2016-06-18 07:40:00",
          "remark": "离开贵阳市 发往毕节地区（经转）【贵阳市】",
          "zone": ""
        },
        {
          "datetime": "2016-06-18 09:59:00",
          "remark": "离开贵阳市 发往下一城市（经转）【贵阳市】",
          "zone": ""
        },
        {
          "datetime": "2016-06-18 12:01:00",
          "remark": "到达  纳雍县 处理中心【毕节地区】",
          "zone": ""
        },
        {
          "datetime": "2016-06-18 17:34:00",
          "remark": "离开纳雍县 发往纳雍县阳长邮政支局【毕节地区】",
          "zone": ""
        },
        {
          "datetime": "2016-06-20 17:55:00",
          "remark": "投递并签收，签收人：单位收发章 *【毕节地区】",
          "zone": ""
        }
      ]
    },
    "error_code": 0 /* 错误码，0表示查询正常，其他表示查询不到物流信息或发生了其他错误 */
  }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let order_num = options.id;
      this.logisticsQuery(order_num,true)
       
  },
  //查看物流
  logisticsQuery(order_num,debug_logistics){
    this.header(app.globalData.url+'logisticsQuery');
    wx.request({
      url:app.globalData.url + 'logisticsQuery',
      method: 'GET',
      header: this.data.header,
      data: {
        order_num: order_num,
        debug_logistics:debug_logistics
      },
      success: res => {
        if (res.data.code == 200) {
          var res = res.data.data.callback;
          res.pay_time = utils.formatTime(res.pay_time,'Y-M-D h:m:s')
          var listO = res.logistics_list[0];
          var listT = res.logistics_list.slice(1);
          this.setData({
            lists:res,
            listO:listO,
            listT:listT
          })
        }else{
          utils.error(res);
        }
      }
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