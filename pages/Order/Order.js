var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js'); 
var app = getApp()
// pages/Earn/Ear.js
Page({

  data: {
    currentTab: 0,
    heightVal:500,
  },
  /**
   * 页面的初始数据
   */
  //提现
  withdraw: function () {
  },
  //返回上一页
  back:function(){
    // let tz = this.data.tz;
    // if(tz == 1){
      wx.switchTab({
        url: '../UserCenter/userCenter',
      })
    // }else{
    //   wx.navigateBack({
    //     delta: 1,
    //   })
    // }
  },
  check(e){
    let order_num =e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../Logistics/logistics?id='+order_num,
    })
  },
  //待支付
  toPay(e){
    app.types = 2;
    app.index = 1;
    let state = e.currentTarget.dataset.status;
    let order_num = e.currentTarget.dataset.order;
    if(state == 0 || state ==2){
      this.getWaitPay(order_num)
    }
  },
  toPays(e){
    let state = e.currentTarget.dataset.status;
    let order_num = e.currentTarget.dataset.order;
    this.orderArticle(order_num)
  },
  
  //提醒发货
  remind(){
    this.show('已提醒卖家发货,请耐心等待')
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tz = getApp().tz;
    this.setData({
      tz:tz
    })
    //获取元素宽高
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowWidth: res.windowWidth
        })
      },
    })
        new app.ToastPannel();
        var that = this;    
        var state = options.state;
        console.log(state)
        if(state == 0){
          that.setData({
            "currentTab": 0,
          })
         }else{
          that.setData({
            "currentTab":state
          })
         }
        //点击之后获取到的值
        var value = getApp().tab;
        var singleNavWidth = this.data.windowWidth /5;
       
        switch (value) {
          case "待支付":
            state = 0;
            that.setData({
              "id": 0,
              "currentTab": 1,
            })
            break;
          case "我的订单":
            state = '';
            that.setData({
              "currentTab":0,
              "id": '',
            })
            break;
          case "待助力":
            state = 1;
            that.setData({
              "currentTab":2,
              "id": 1,
            })
            break;

          case "待发货":
            state = 2;
            that.setData({
              "currentTab":3,
              "id":2
            })
            break;

          case "待收货":
            state = 3;
            that.setData({
              "currentTab":4,
              "id":3
            })
            break;

          case "待评价":
            state = 4;
            that.setData({
              "currentTab": 5,
              "id": 4
            })
            break;
             }
          that.setData({
            navScrollLeft: (that.data.currentTab - 2) * singleNavWidth,
        })
          that.getOrder(this.data.id)
 
  },


  //点击切换
  clickTab: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    var currentTab = e.target.dataset.current;
    var singleNavWidth = this.data.windowWidth /5;

    if (this.data.currentTab === currentTab) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        id:id,
    //tab选项居中                            
      navScrollLeft: (currentTab) * singleNavWidth,
      })
      that.getOrder(id)
    }
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.Modal = this.selectComponent("#modal");
    this.Modals = this.selectComponent("#modals");

  },
  //确认收货弹窗
  _Modals: function (e){
    let order = e.target.dataset.order;
    this.setData({
      order:order
    })
    this.Modals.showModal();
  },
  //确认收货
  confirm(e){
    let order = this.data.order;
    this.confirmReceipt(order)
  },
  //取消收货
  cancel(){
    this.Modals.hideModal();
  },
  //确认收货接口
  confirmReceipt(order_num){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url +'confirmReceipt');
    wx.request({
      url: app.globalData.url +'confirmReceipt',
      header:this.data.header,
      data:{
        order_num:order_num
      },
      method:'POST',
      success:res=>{
        this.setData({
          isShow:false
        })
          if(res.data.code == 200){
            this.Modals.hideModal();
            this.show(res.data.msg);
            this.getOrder(4)
            this.setData({
              "currentTab": 5,
              "id": 4
            })
          }else{
            this.Modals.hideModal();
          }
      }
    })
  },
  _onShowModal: function (e) {
    this.Modal.showModal();
    let index = e.target.dataset.index;
    let order_num = e.target.dataset.order;
    this.setData({
      index:index,
      order_num:order_num
    })
  },
  _confirmEventFirst: function(){
    this.Modal.hideModal();
    this.invalidOrder(this.data.order_num,this.data.index)
  },
  _cancelEvent: function () {
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
        "logintype":logintype
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
  //获取订单数据
  getOrder(order_status){
    this.setData({
      isShow:true
    })
    var that = this;
    that.header(app.globalData.url + 'orderList');
    wx.request({
      url: app.globalData.url + 'orderList',
      method: 'GET',
      header: that.data.header,
      data: {
        order_status: order_status
      },
      success: res => {
        this.setData({
          isShow:false
        })
        if (res.data.code == 200) {
          var detail = res.data.data.callback.order_list;
          let date = Math.round(new Date().getTime() / 1000).toString();
          for(var i=0;i < detail.length;i++){
            var s = detail[i].share_queue
            if (s.share_queue_id){
              let endDate = s.expire_time.length == 10 ? s.expire_time * 1000 : s.expire_time;
              //截止时间
              s.expire_time = (Number(endDate) - Number(date)) * 1000;
              that.setData({
                zuli:0
              })
              app.zuli = 0;
            }else{
             that.setData({
               zuli:1
             })
             app.zuli = 1;
            }
          }

          that.setData({
            detail: detail,
            listData:detail
          })
          that.setCountDown()
        }else{
          utils.error(res);
        }
      }
    })
  },
  //助力跳转
  helpD(e){
    app.share_num = e.currentTarget.dataset.num,
    wx.navigateTo({
      url: '../Share/Share?num=' + e.currentTarget.dataset.num,
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
      if(v.share_queue.expire_time){
        v.share_queue.state = 1
      }else{
        v.share_queue.state =0
      }
      if (v.share_queue.expire_time <= 0) {
        v.share_queue.expire_time = 0;
      }
      let formatTime = this.getFormat(v.share_queue.expire_time);
      v.share_queue.expire_time-= time;
      v.countDown = `${formatTime.hh}:${formatTime.mm}:${formatTime.ss}.${parseInt(formatTime.ms / time)}`;
      v.hh = `${formatTime.hh}`
      v.mm = `${formatTime.mm}`;
      v.ss = `${formatTime.ss}`;
      v.ms = `${ parseInt(formatTime.ms / time) }`;
      return v;
    })
    this.setData({
      listData: list
    });
    setTimeout(this.setCountDown, time);
  },
  //未支付订单详情
  orderArticle(order_num){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url +'orderArticle');
    wx.request({
      url: app.globalData.url + 'orderArticle',
      header:this.data.header,
      method:'get',
      data:{
        order_num: order_num
      },
      success:res=>{
        this.setData({
          isShow:false
        })
        if(res.data.code ==200){
          let callback = JSON.stringify(res.data.data);
          wx.navigateTo({
            url: '../waitPay/waitPay?callback='+callback,
          })
        } else {
          utils.error(res);
        }
      }


    })
  },
  // 去支付
  getWaitPay(order_num) {
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url + 'getWaitPay');
    wx.request({
      url: app.globalData.url + 'getWaitPay',
      method: 'get',
      header: this.data.header,
      data: {
        order_num: order_num
      },
      success: res => {
        this.setData({
          isShow:false
        })
        if(res.data.code == 200){
          wx.setStorageSync('details', res.data.data.callback);
          wx.setStorageSync('market_price', res.data.data.callback.mall_goods.sale_price);

          wx.setStorageSync('discount_money', res.data.data.callback.discount_money);
          app.types = 1;
          wx.navigateTo({
            url: '../Confirm/Confirm?types=1',
          })
        }
       
      }

    })
  },
  //取消订单
  invalidOrder(order_num,index){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url + 'invalidOrder');
    let detail = this.data.listData;
    wx.request({
      url: app.globalData.url + 'invalidOrder',
      header: this.data.header,
      method: 'post',
      data: {
        order_num: order_num
      },
      success: res => {
        this.setData({
          isShow:false
        })
        if (res.data.code == 200) {
          detail.splice(index,1)
          this.setData({
            listData:detail
          })
        } else {
          utils.error(res);
        }
      }


    })
  }
})