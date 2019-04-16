// pages/Robmoney/Robmoney.js
var util = require('../../utils/md5.js')
var utils = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionSheetItems: '',
    actionSheetHidden: true,
    itemChange: '',
    timestamp: '',
    interval: '',
    hrStr: '',
    minStr: '',
    secStr: '',
    id: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goods_type = options.type;
    this.setData({
      goods_type:goods_type
    })
    this.giftGroupList(goods_type);
    this.toGiftGroupList(0, 0, goods_type, 1);
    new app.ToastPannels();
    
  },

  listenerButton: function () {
    this.setData({
      //取反
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },

  listenerActionSheet: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  //选取会员
  itemChange(e) {
    var text = e.target.dataset.text;
    var type = e.target.dataset.id;
    var total = e.target.dataset.total;
    this.toGiftGroupList(0, type, 0, 1);
    this.setData({
      itemChange: text,
      type: type,
      actionSheetHidden: !this.data.actionSheetHidden,
      total: total
    })
  },

  //全部商品弹窗显示
  allChange() {
    wx.showActionSheet({
      itemColor: '#333',
      itemSize: '12'
    })
  },
  
  onUnload() {
   
  },
  onHide() {
   
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
  //获取礼品列表分组信息
  giftGroupList(goods_type) {
    this.setData({
      isShow:true
    })
    var that = this;
    this.header(app.globalData.url + 'giftGroupList');
    wx.request({
      url: app.globalData.url + 'giftGroupList',
      method: 'get',
      header: that.data.header,
      data: {
        goods_type: goods_type
      },
      success: res => {
        this.setData({
          isShow:false
        })
        if (res.data.code == 200) {
          that.setData({
            actionSheetItems: res.data.data,
            itemChange: res.data.data[0].name,
            id: res.data.data[0].member_group_id,
            total: res.data.data[0].goods_group_total
          })
        }
      }
    })
  },
  //获取免费礼品信息
  toGiftGroupList(classify_id, member_group_id, goods_type, now_page) {
    this.setData({
      isShow:true
    })
    var that = this;
    this.header(app.globalData.url + 'giftGoodsList');
    wx.request({
      url: app.globalData.url + 'giftGoodsList',
      method: 'get',
      header: that.data.header,
      data: {
        classify_id: classify_id,
        member_group_id: member_group_id,
        goods_type: that.data.goods_type,
        now_page: now_page
      },
      success: res => {
        this.setData({
          isShow:false
        })
        if (res.data.code == 200) {
          var detail = res.data.data.goods_list;
          let date = Math.round(new Date().getTime() / 1000).toString();
          for (var i = 0; i < detail.length; i++) {
            var s = detail[i]
            if (s.tomorrow_time) {
              let endDate = s.tomorrow_time.length == 10 ? s.tomorrow_time * 1000 : s.tomorrow_time;
              //截止时间
              s.tomorrow_time = (Number(endDate) - Number(date)) * 1000;
            }
          }
          this.setData({
            listData: detail
          })
          that.setCountDown()
          
        }
      }
    })
  },
  /**
   * 格式化时间
   */
  getFormat: function (msec) {
    let ss = parseInt(msec / 1000);
    let ms = parseInt(msec % 1000);
    let mm = 0;
    let hh = 0;
    if (ss > 60) {
      mm = parseInt(ss / 60);
      ss = parseInt(ss % 60);
      if (mm > 60) {
        hh = parseInt(mm / 60);
        mm = parseInt(mm % 60);
      }
    }
    ss = ss > 9 ? ss : `0${ss}`;
    mm = mm > 9 ? mm : `0${mm}`;
    hh = hh > 9 ? hh : `0${hh}`;
    return { ms, ss, mm, hh };
  },
  //  /**
  //    * 倒计时
  //    */
  setCountDown: function () {
    let time = 100;
    let { listData } = this.data;
    let list = listData.map((v, i) => {
      if (v.tomorrow_time <= 0) {
        v.tomorrow_time = 0;
      }
      let formatTime = this.getFormat(v.tomorrow_time);
      v.tomorrow_time -= time;
      v.countDown = `${formatTime.hh}:${formatTime.mm}:${formatTime.ss}.${parseInt(formatTime.ms / time)}`;
      v.hh = `${formatTime.hh}`
      v.mm = `${formatTime.mm}`;
      v.ss = `${formatTime.ss}`;
      v.ms = `${parseInt(formatTime.ms / time)}`;
      return v;
    })
    this.setData({
      listData: list
    });
    setTimeout(this.setCountDown, time);
  },
  //点击跳转详情
  navCont(e) {
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    let list = this.data.listData;
    // 
    if (list[type].sell_out_ratio == 1 ) {
      this.shows(list[type].sell_out_error)
    } else{
      //跳转携参
      wx.navigateTo({
        url: '../RobDeatail/RobDeatail?id=' + id + '&lock=' + list[type].is_unlock + '&tip=' + list[type].is_unlock_tips,
      })
    }
     
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
  onShow:function(){
  }

  /**
   * 用户点击右上角分享
   */
  
})