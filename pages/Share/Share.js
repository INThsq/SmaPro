var app = getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
import Card from '../../palette/image-example.js';

Page({
  data: {
    
    hour:'00',
    minutes:'00',
    seconds:'00',
    mill:'00',
    clickType:true,
    left: 0,
    interval: '',
    hide:true,
    info:{
      ctitle: 'TA们刚刚提现了',
    },
    control: {
      current: '',
    },
    interval:2000, //时间间隔
    controlType: {
      nextMargin: '500rpx'
    },
    imageshare:'',
    list: {},
  },
  onLoad(options) {
    let type = options.type
    let goods_num = options.goods_num
    let is_discount = options.is_discount
    let mall_goods_id = options.mall_goods_id
    let mall_sku_id = options.mall_sku_id
    let order_num = options.order_num
    let total_fee = options.total_fee
    let num = options.num
    // wx.showToast({
    //   title:num,
    // })

    var that = this
    var list = that.data.list
    var ylist = that.data.ylist
    that.setData({
      list: ylist,
      goods_num:goods_num,
      type:type
    })
    if(num){
      that.praiseArticle(num)
    }else{
      that.shareCash(order_num, mall_goods_id, mall_sku_id, total_fee, goods_num, is_discount)
    }
  },
  onReady(){
    this.Modal = this.selectComponent("#modal");

  },
  _cancelEvent: function () {
    this.Modal.hideModal();
    app.tz =1;
    wx.navigateTo({
      url: '../Order/Order?state=2',
    })
  },
  back(){
    this.Modal.showModal();
  },
  _confirmEventFirst: function () {
    this.Modal.hideModal();
  },
  click(){
   let type = this.data.type;
   if(type){
     wx.switchTab({
       url: '/pages/index/index',
     })
   }
  },
  //点击分享时间
  fxclick() {
    var that = this
    var list = that.data.list
    var clist = that.data.clist
    var info = that.data.info
    // info.percent = ++info.percent
    that.setData({
      clickType: true,
      list: clist,
      info: info
    })
    that.progress();
    // wx.navigateTo({
    //   url: '/pages/EarnMoney/EarnMoney',
    // })
  },
  //主页购物
  goShop(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  //向下滚动
  inter() {
    let that = this
    setInterval(function(){
      if (that.data.control.current > 0) {
        that.setData({
          control: {
            showNums: that.data.control.showNums,
            current: that.data.control.current - 1
          }
        })
      } else if (that.data.control.current == 0) {
        that.setData({
          control: {
            showNums: that.data.control.showNums,
            current: that.data.give_count_list.length - 1
          }
        })
      }
    }, that.data.interval)
  },
  //关闭红包
  ClosePacket(){
    this.setData({
      hide:true
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
  //获取数据
  shareCash(order_num, mall_goods_id, mall_sku_id, total_fee, goods_num, is_discount){
    var that = this
    console.log(that.header(app.globalData.url + 'saveVirtualMoney'))
    that.header(app.globalData.url + 'saveVirtualMoney');
    wx.request({
      url: app.globalData.url + 'saveVirtualMoney',
      method: 'POST',
      header: that.data.header,
      data: {
          order_num:order_num,
          mall_goods_id: mall_goods_id,
          mall_sku_id: mall_sku_id,
          total_fee: total_fee,
          goods_num: goods_num,
          is_discount: is_discount
      },
      success:res=>{
        if (res.data.code == 200) {
          this.setData({
            template: new Card().palette({
              money: res.data.data.callback.share_queue.activity_money
            }),
          });
          var left = Math.round(490 / 100 * Number(res.data.data.callback.share_queue.balance));
          var progress = Math.round((Number(res.data.data.callback.share_queue.balance) / Number(res.data.data.callback.share_queue.activity_money)) * 100)
          that.setData({
            detail: res.data.data.callback,
            give_count_list:res.data.data.callback.share_cash,
            left:left,
            progress:progress,
            cash:1,
            money: res.data.data.callback.share_queue.activity_money
          })
          that.setData({
            control:{
              showNums: that.data.control.showNums,
              current:res.data.data.callback.share_cash.length - 1
            }
          })
          if(res.data.data.callback.share_cash.length >4){
            that.inter()
          }
          that.time(res.data.data.callback.share_queue.expire_time)
        }

        }
    })
  },
  onImgOK(e) {
    this.imagePath = e.detail.path;
    this.setData({
      imageshare: e.detail.path
    })
  },
  //助力详情获取数据
  praiseArticle(num){
    var that = this
    that.header(app.globalData.url + 'praiseArticle');
    wx.request({
      url: app.globalData.url + 'praiseArticle',
      method: 'get',
      header: that.data.header,
      data: {
        order_num: num,
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            template: new Card().palette({
              money: res.data.data.callback.share_queue.activity_money
            }),
          });
          var left = Math.round( 490 / 100 * Number(res.data.data.callback.share_queue.balance));
          var progress = Math.round((Number(res.data.data.callback.share_queue.balance) / Number(res.data.data.callback.share_queue.activity_money)) * 100)
          that.setData({
            detail: res.data.data.callback,
            left:left,
            progress: progress,
            give_count_list:res.data.data.callback.share_cash,
            money: res.data.data.callback.share_queue.activity_money

          })
          that.setData({
          
            control:{
              showNums: that.data.control.showNums,
              current:res.data.data.callback.share_cash.length - 1
            }
          })
          if(res.data.data.callback.share_cash.length >4){
            that.inter()

          }
          that.time(res.data.data.callback.share_queue.expire_time)
        }else{
          utils.error(res);
        }
      }
    })
  },
  onShareAppMessage: function (ops) {
    let that = this;
    let share_queue_id = that.data.detail.share_queue.share_queue_id;
    console.log(that.data.imageshare)
    return {
      title: '我刚领了红包也分你一个,帮我提现你也能拿到红包哦~', // 转发后 所显示的title
      path: '/pages/index/index?share_queue_id=' + share_queue_id, // 相对的路径
      imageUrl: this.data.imageshare,
      success: (res) => {    // 成功后要做的事情

      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  //倒计时
  time(t) {
    var that = this;
    var timer = setInterval(function () {
      let now = (new Date()).getTime();//当前时间戳
      if (t < 10000000000) {
        var differ = t * 1000 - now;//离结束相差的时间(毫秒)      
      } else {
        var differ = t - now;//离结束相差的时间(毫秒)  
      }
      if (differ <= 0) {
        clearInterval(timer);
        return false;
      }
      let hour = Math.floor(differ / (60 * 60 * 1000));
      //剩余的小时
      differ = differ % (60 * 60 * 1000);
      let minutes = Math.floor(differ / (60 * 1000));
      //剩余的分钟
      differ = differ % (60 * 1000);
      let seconds = Math.floor(differ / 1000);
      //剩余的秒数
      differ = Math.floor((differ % 1000) / 100);
      let mill = differ;
      if (mill < 10) { mill =  mill }
      that.setData({ mill: mill });
    }, 100)
    var timer1 = setInterval(function () {
      let now = (new Date()).getTime();//当前时间戳
      if (t < 10000000000) {
        var differ = t * 1000 - now;//离结束相差的时间(毫秒)      
      } else {
        var differ = t - now;//离结束相差的时间(毫秒)  
      }
      if (differ <= 0) {
        clearInterval(timer1);
        return false;
      }
      let hour = Math.floor(differ / (60 * 60 * 1000));
      //剩余的小时
      if (hour < 10) { hour = "0" + hour }
      that.setData({ hour: hour });
      differ = differ % (60 * 60 * 1000);
      let minutes = Math.floor(differ / (60 * 1000));
      //剩余的分钟
      if (minutes < 10) { minutes = "0" + minutes }

      that.setData({ minutes: minutes });
      that.minutes = minutes;
      differ = differ % (60 * 1000);
      let seconds = Math.floor(differ / 1000);
      //剩余的秒数
      if (seconds < 10) { seconds = "0" + seconds }

      that.setData({ seconds: seconds });
      that.seconds = seconds;
    }, 1000)
  }

})