// search/search.js
var util = require('../../utils/md5.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    searchRecord: [],
    all: ['男士男装', '小白鞋', '家居', '电器','手表'],
    histroy:true,
    del:true,
    One:false,
    imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_h.png',
    conts:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.openHistorySearch();
    this.goodsList(0, 2, 1);
    new app.ToastPannel();
    let search_term = options.search_term;
    if(search_term){
      this.setData({
        searchValue: search_term,
        inputVal:search_term
      })
      this.searchSubmitFn();
    }
    
  },
  // 内容赋值
  Assign(e){
    let text = e.currentTarget.dataset.text;
    this.setData({
      searchValue:text
    })
    this.searchSubmitFn();
  },
  // 打开历史缓存
  openHistorySearch: function () {
    let his = wx.getStorageSync('searchRecord');
    let newArr = Array.from(new Set(his));
    if (newArr.length > 0){
      this.setData({
        histroy:false
      })
    }else{
      histroy:true
    }
    this.setData({
      searchRecord: newArr || [],//若无储存则为空
    })
  },
  //点击搜索按钮提交表单跳转并储存历史记录
  searchSubmitFn: function (e) {
    let searchValue = this.data.searchValue;
    if (e){
      var inputVal = e.detail.value||this.data.inputVal
      this.setData({
        One: true,
        conts: false,
        del: false,
      })
    }else{
      var inputVal = searchValue;
      this.setData({
        One: true,
        conts: false,
        del: false,
      })
    }
    let searchRecord = this.data.searchRecord;
    if (inputVal == '') {
      //输入为空时的处理
      this.show('关键字不能为空')
      this.setData({
        One:false,
        conts:true
      })
    }
    else {
      let arrnum = searchRecord.indexOf(inputVal);
      //将搜索值放入历史记录中,只能放前五条
      if (searchRecord.length <= 10) {
        searchRecord.unshift(inputVal)
      }
      else {
        searchRecord.pop()//删掉旧的时间最早的第一条
        searchRecord.unshift(inputVal)
      }
      //将历史记录数组整体储存到缓存中
      if(searchRecord.length>0){
        searchRecord = Array.from(new Set(searchRecord));
        wx.setStorageSync('searchRecord', searchRecord)
        this.setData({
          'searchRecord': searchRecord,
          histroy:false
        })
      }else{
        this.setData({
          histroy:true
        })
      }
     
    }
  },
  // 删除历史记录
  historyDelFn: function () {
    wx.clearStorageSync('searhRecord');
    this.setData({
      histroy:true
    })  
    this.setData({
      searchRecord: []
    })
  },
  //判断删除符号
  keyword(e){
    let val = e.detail.value;
    if(val.length>0){
      this.setData({
        del:false
      })
    }else{
      this.setData({
        del:true,
        One: false,
        conts: true
      })
    }
    if(val.length >20){
      this.show('您输入的内容太长,建议在20字以内哦~')
    }
  },
  //删除字段
  del(){
    this.setData({
        searchValue:'',
        del:true,
        One: false,
        conts: true
    })
  },
  //列表
  goodsList(classify_id, goods_type, now_page) {
    this.header(app.globalData.url + 'goodsList');
    wx.request({
      url: app.globalData.url + 'goodsList',
      method: 'GET',
      header: this.data.header,
      data: {
        classify_id: classify_id,
        goods_type: goods_type,
        now_page: now_page
      },
      success: res => {
        if (res.data.code == 200) {
          let listx = res.data.data.goods_list;
         
          this.setData({
            listx: listx,
            page: res.data.data.now_page
          })
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