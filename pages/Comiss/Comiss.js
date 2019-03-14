var app = getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js'); 

Page({
  data: {
    selected: true,
    selected1: false,
    num:0,
    del:true,
    picture:'http://oss.myzy.com.cn/wechat/images/icon_xiala_xia.png'
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  //选择位置位置
  chooseLocation: function (e) {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        // success
        console.log(res)
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },
  Sq(){
    wx.navigateTo({
      url: '../Explain/Explain',
    })
  },
  Tj() {
    wx.navigateTo({
      url: '../Recom/Recom',
    })
  },
 
  //展开福利
  Sum(){
    let num = this.data.num;
    if(num == 0){
      this.setData({
        num:1,
        picture: 'http://oss.myzy.com.cn/wechat/images/icon_xiala_shang.png'

      })
    }else{
      this.setData({
        num:0,
        picture:'http://oss.myzy.com.cn/wechat/images/icon_xiala_xia.png'
      })
    }
  },
  //获取input 内值
  keyword(e) {
    let val = e.detail.value;
    if (val.length > 0) {
      this.setData({
        del: false,
        searchValue: val
      })
    } else {
      this.setData({
        del: true,
      })
    }
    if (val.length > 12) {
      this.show('您输入的内容太长,建议在20字以内哦~')
    }
  },
  //删除
  del() {
    this.setData({
      searchValue: '',
      del: true
    })
  },
  Come(){
    wx.navigateTo({
      url: '../FyCenter/FyCenter',
    })
  },
  //赠送活动
  giveaway(keywords, now_page){
    this.header(app.globalData.url +'giveaway');
    wx.request({
      url: app.globalData.url +'giveaway',
      method:'get',
      header:this.data.header,
      data:{
        keywords:keywords,
        now_page:now_page
      },
      success:res=>{
        if(res.data.code == 200){
          let list  = res.data.data.callback.list;
          if(list.length>0){
            for (let l = 0; l < list.length; l++) {
              let welfare = list[l].welfare;
              let we = [];
              for (let n = 0; n < welfare.length; n++) {
                we.push(welfare[n].split('|'));
              }
              res.data.data.callback.list[l].welfare = we;
              this.setData({
                list: list
              })
            }
          }
          
          
        }
        console.log(res)
      }
      

    })
  },
  onLoad(){
    this.giveaway('',1)
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

})