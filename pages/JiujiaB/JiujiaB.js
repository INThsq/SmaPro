// pages/JiujiaB/JiujiaB.js
var app= getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: ['加盟福利','加盟条件'],
    cursetIndex:0,
    show:true,
    video:true,
    data:[
      {
        img:'http://oss.myzy.com.cn/wechat/images/icon_disabled_1.png',
        num:'01',
        wz:'意向沟通'
      },
      {
        img: 'http://oss.myzy.com.cn/wechat/images/icon_disabled_2.png',
        num: '02',
        wz: '实地考察'
      },
      {
        img: 'http://oss.myzy.com.cn/wechat/images/icon_disabled_3.png',
        num: '03',
        wz: '体验产品'
      },
      {
        img: 'http://oss.myzy.com.cn/wechat/images/icon_disabled_4.png',
        num: '04',
        wz: '自提点申请'
      },
      {
        img: 'http://oss.myzy.com.cn/wechat/images/icon_disabled_5.png',
        num: '05',
        wz: '付费签约'
      },
      {
        img: 'http://oss.myzy.com.cn/wechat/images/icon_disabled_6.png',
        num: '06',
        wz: '公司配货'
      },
      {
        img: 'http://oss.myzy.com.cn/wechat/images/icon_disabled_7.png',
        num: '07',
        wz: '筹备营业'
      },
      {
        img: 'http://oss.myzy.com.cn/wechat/images/icon_disabled_8.png',
        num: '08',
        wz: '运营分红'
      }
    ],
    datas:[
      {
        img: 'http://oss.myzy.com.cn/wechat/images/icon_gouwu.png',
        num: '1',
        wz: '协助分销商',
        wz1:'订单核验'
      },
      {
        img: 'http://oss.myzy.com.cn/wechat/images/icon_zengsong.png',
        num: '2',
        wz: '核销订单',
        wz1: '获得佣金'

      },
      {
        img: 'http://oss.myzy.com.cn/wechat/images/icon_huoquyongjin.png',
        num: '3',
        wz: '完成核验任务',
        wz1: '返还押金'

      }
    ],
    url: 'http://oss.myzy.com.cn/wechat/images/img_jj_8.png',
    check: 1,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  playvedio: function (e) {
    let vediocon = wx.createVideoContext("myvedio", this)
    vediocon.play()
    this.setData({
      show: false,
      video: false
    })
  },
  onLoad: function (options) {
    new app.ToastPannels();
    let member_mall_id = options.member_mall_id;
    if(member_mall_id){
      console.log('1')
      let money = options.money;
      let name = options.name;
      let account_balance = options.account_balance;
      let buy_tips = options.buy_tips;
      this.setData({
        money: money,
        member_mall_id: member_mall_id,
        name: name,
        account_balance: account_balance,
        buy_tips: buy_tips
      })
      this.getMallDot(member_mall_id)

    }else{
      let member_mall_id = options.id;
      this.getMallDot(member_mall_id)
      console.log('2')
    }
  },
  choose(e) {
    let src = e.target.dataset.src;
    if (src == 'http://oss.myzy.com.cn/wechat/images/img_jj_8.png') {
      this.setData({
        url: "http://oss.myzy.com.cn/wechat/images/img_jj_7.png",
        check: 0
      })
    } else {
      this.setData({
        url: "http://oss.myzy.com.cn/wechat/images/img_jj_8.png",
        check: 1
      })
    }
  },
  //跳转协议
  Equit(e){
    console.log(e)
    let src = e.currentTarget.dataset.src;
    wx.navigateTo({
      url:"../Webview/Webview?h5="+src
    })
  },
  Bind(e){
    this.setData({
      scrollTop:e.detail.scrollTop
    })
  },
  Go() {
    let name = this.data.name;
    let telephone = this.data.telephone;
    let money = this.data.money;
    let member_mall_id = this.data.member_mall_id;
    let account_balance = this.data.account_balance;
    let content = wx.getStorageSync('content');
    let check = this.data.check;
    let is_open_giveaway = this.data.callback.is_open_giveaway
    if (content) {
      if(!is_open_giveaway){
        this.Modal.showModal();
      }else{

      switch(check){
        case 1:
          this.shows('请勾选权益说明后再进行购买');
          break;
        case 0:
          wx.navigateTo({
            url: '../Apply/Apply?name=' + name + '&telephone=' + telephone + '&money=' + money + '&member_mall_id=' + member_mall_id + '&account_balance=' + account_balance,
          })
        break;
      }
    }

     
    } else {
      wx.navigateTo({
        url: '../Accredit/Accredit',
      })
    }

  },
  _confirmEventFirst: function () {
    let member_mall_id = this.data.callback.mall_dot.member_mall_id;
    this.Modal.hideModal();

    this.activity(member_mall_id);
  },
  _cancelEvent: function () {
    this.Modal.hideModal();

  },
   
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.Modal = this.selectComponent("#modal");

  },
  //活动
  activity(member_mall_id) {
    this.header(app.globalData.url + 'activity');
    wx.request({
      url: app.globalData.url + 'activity',
      method: 'get',
      data:{
        member_mall_id: member_mall_id
      },
      header: this.data.header,
      success: res => {
        if (res.data.code == 200) {
          let type = res.data.data.callback.type;
          switch (type) {
            case 0:
              app.scenes = 1;
              wx.setStorageSync('datas', res.data.data.callback)
              wx.navigateTo({
                url: '../jjb/jjb?data=' + JSON.stringify(res.data.data.callback),
              })
              break;
            case 1:
              this.distribution('')
              app.scenes = 0;
              break;
          }
        } else {
          this.show(res.data.code)
        }
      }
    })
  },
 //自提点
 getMallDot(member_mall_id){
  this.setData({
    isShow:true
  })
  this.header(app.globalData.url +'getMallDot');
  wx.request({
    url: app.globalData.url +'getMallDot',
    header:this.data.header,
    data:{
      member_mall_id: member_mall_id
    },
    method:'get',
    success:res=>{
      this.setData({
        isShow:false
      })
         if(res.data.code==200){
           this.setData({
            callback:res.data.data.callback,
            money:res.data.data.callback.mall_dot.money,
            member_mall_id:res.data.data.callback.mall_dot.member_mall_id,
            name:res.data.data.callback.mall_dot.name,
            account_balance:res.data.data.callback.account_balance,
            buy_tips:res.data.data.callback.buy_tips,
            telephone:res.data.data.callback.mall_dot.telephone,
            activity_url:res.data.data.callback.web_url,
           })
           app.jjb=1;
         }else{
           this.shows(res.data.msg);
          
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
  getCur(e){
    console.log(e)
    this.setData({
      cursetIndex: e.target.dataset.index
    })
  }
})