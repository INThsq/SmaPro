// pages/RobDeatail/RobDeatail.js
var util = require('../../utils/md5.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    control: {
      current:'',
    },
    interval: 1000, //时间间隔
    controlType:{
      nextMargin:'250rpx'
    },
    annoType: false,
    imgUrls: [],
    autoplay: true,
    interval:1900,
    duration: 1000,
    swiperCurrent: 0,
    control:{
      current:'',
    },
    intervals:0, //时间间隔
    controlType:{
      nextMargin:'94rpx'
    }
  },
  //轮播图事件
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //商品详情跳转
  detail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../Details/Details?id='+id,
    })
  },
 //向下滚动事件
  inter() {
    let that = this
    setInterval(function(){
      if (that.data.control.current > 0) {
        that.setData({
          control: {
            current: that.data.control.current - 1
          }
        })
      } else if (that.data.control.current == 0) {
        that.setData({
          control: {
            current: that.data.give_count_list.length - 1
          }
        })
      }
    }, that.data.interval)
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
  //获取礼品详情
  giftDetails(goods_id){
    var that = this;
    that.header(app.globalData.url + 'giftDetails');
    wx.request({
      url: app.globalData.url + 'giftDetails',
      method: 'GET',
      header: that.data.header,
      data: {
        goods_id:goods_id
      },
      success: res => {
        if (res.data.code == 200) {
          var detail = res.data.data.gift_goods_list;
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
          });
          that.setCountDown()
              that.setData({
                detail:res.data.data,
                imgUrls:res.data.data.goods_details.images,
                give_count_list: res.data.data.give_count_list
              })
          wx.setStorageSync('goods', res.data.data.goods_details);
          that.setData({
            control:{
              current: res.data.data.give_count_list.length - 1
            }
          })
          that.inter()
        }
      }
    })
  },
  //点击跳转详情
  navCont(e) {
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    let list = this.data.listData;
    // 
    if (list[type].sell_out_ratio == 1) {
      this.show(list[type].sell_out_error)
    } else {
      //跳转携参
      wx.navigateTo({
        url: '../RobDeatail/RobDeatail?id=' + id + '&lock=' + list[type].is_unlock + '&tip=' + list[type].is_unlock_tips,
      })
    }

  },
  //返回上一页 
  back: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  //跳转立即开团
  goOpen(e){
      let content = wx.getStorageSync('content');
      let lock = this.data.lock;
      let tip = this.data.tip; 
      if (content !== '' && lock == 1){
            wx.navigateTo({
              url: '../Startgroup/Startgroup?id=' + e.currentTarget.dataset.id,
            })
      }else if(content == ''){
            wx.navigateTo({
              url: '../Accredit/Accredit',
            })
      }else{
            this.show(tip)
      }
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    let id = options.id;
    let lock = options.lock;
    let tip = options.tip;
    this.giftDetails(id);
    var content = wx.getStorageSync('content');
    this.setData({
      content:content,
      lock:lock,
      tip:tip
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
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getHeight();
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

})