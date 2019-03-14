// pages/CareShop/CareShop.js
var util = require('../../utils/md5.js');
var app = getApp();
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top: '',
    //收藏
    collect: 'http://oss.myzy.com.cn/wechat/images/icon_sjzx_sc.png',
    datacol: '0',
    imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_h.png',
    dataindex: 0,
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    shopInfo: '',
    store_list: '',
    page: 1,
    hidden: true,
    load: '加载中...',
    res: '',
    store_info: ''

  },
  tabFun: function (e) {
    //获取触发事件组件的dataset属性 
    var _datasetId = e.target.dataset.id;
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj
    });
  },
  //跳转
  detail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../Details/Details?id=' + id,
    })
  },
  //点击收藏
  collect: function (e) {
    // var col = e.target.dataset.col;
    var that = this;
    that.setData({
      collect: 'http://oss.myzy.com.cn/wechat/images/icon_sjzx_sch.png',

    })
    wx.showToast({
      title: '收藏成功',  //标题
      duration: 2000, //提示的延迟时间，单位毫秒，默认：1500

    })
  },
  // 价格排序
  changechoose: function (e) {
    var index = e.target.dataset.index;
    console.log(index);
    index++;
    var that = this;
    if (index == 1) {
      that.setData({
        dataindex: index,
        imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_s.png'
      })
    } else if (index == 2) {
      that.setData({
        dataindex: index,
        imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_x.png'
      })
    } else {
      that.setData({
        dataindex: 1,
        imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_s.png'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let store_id = options.id;
    console.log(store_id)
    this.getInfo(store_id,1);
    this.getShop(store_id);
  },
  scrollTopFun(e) {
    var top = e.detail.scrollTop;
    var that = this;
    that.setData({
      top: top
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //惠小店列表获取
  getInfo(store_id,now_page) {
    this.header(app.globalData.url + 'getStoreList');
    wx.request({
      url: app.globalData.url + 'getStoreList',
      method: 'GET',
      header: this.data.header,
      data:{
        now_page: now_page,
        store_id: store_id,
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            store_list: res.data.data.store_list,
            res: res.data
          })
        } else {
          utils.error(res);
        }
      }
    })
  },
  //惠小店店铺信息
  getShop(store_id) {
    this.header(app.globalData.url + 'store');

    wx.request({
      url: app.globalData.url + 'store',
      method: 'GET',
      header: this.data.header,
      data:{
        store_id: store_id
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            store_info: res.data.data
          })
        } else {
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
  //拨打电话
  calling: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
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
    var that = this;
    console.log('222');
  },
  //上拉加载
  bindDownLoad() {
    this.setData({
      hidden: false,
    })
    if (this.data.res.data.now_page == this.data.page) {
      this.setData({
        load: '没有内容了'
      })
      var that = this;
      setTimeout(function () {
        that.setData({
          hidden: true
        })
      }, 1000)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})