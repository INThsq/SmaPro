// pages/Sale/Sale.js
var util = require('../../utils/md5.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_h.png',
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    }, 
    up:'暂时没有更多内容了~'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type;
    this.setData({
      type:type
    })
    this.goodsList(0,type,1,'')
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
  // 价格排序
  changechoose: function (e) {
    var index = e.target.dataset.index;
    index++;
    var that = this;
    var type = that.data.type;
    if (index == 1) {
      that.goodsList(0, type, 1, 'asc_pric')
      that.setData({
        dataindex: index,
        imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_s.png'
      })
    } else if (index == 2) {
      that.goodsList(0, type, 1, 'desc_pric')
      that.setData({
        dataindex: index,
        imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_x.png'
      })
    } else {
      that.goodsList(0, type, 1, 'asc_pric')
      that.setData({
        dataindex: 1,
        imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_s.png'
      })
    }
  },
  tabFun: function (e) {
    //获取触发事件组件的dataset属性 
    var _datasetId = e.target.dataset.id;
    var type = this.data.type;
    switch(_datasetId){
      //新品
      case "1":
        this.goodsList(0, type, 1, 'asc_create_time');
       break;
       case "2":
       this.goodsList(0, type, 1, 'desc_sales_volume');
       break;
        case "0":
        this.goodsList(0, type, 1, '')
        break;
    }
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj
    });
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
      var header = {
        "sign": password,
        "timestamp": timestamp,
        "noncestr": noncestr,
        "uuid": uuid,
        "token": token,
        "expirytime": expiry_time,
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
  //列表数据
  goodsList(classify_id, goods_type, now_page, keyword) {

    this.header(app.globalData.url+'goodsList');
    wx.request({
      url: app.globalData.url + 'goodsList',
      method: 'GET',
      header: this.data.header,
      data: {
        classify_id: classify_id,
        goods_type: goods_type,
        now_page: now_page,
        keyword: keyword
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            listx: res.data.data.goods_list,
            page: res.data.data.now_page
          })
        }
      }
    })
  },
  //详情页跳转
  detail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../Details/Details?id=' + id,
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
