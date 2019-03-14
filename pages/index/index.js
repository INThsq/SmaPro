var util = require('../../utils/md5.js');
var app = getApp();
// pages/UserCenter/userCenter.js
Page({
  /**
   * 页面的初始数据
   */
  //商家中心
  data: {
    pages:1,
    progress:'',
    left:'',
    wxIndex:'',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navData:'',
    currentTab: 0,
    navScrollLeft: 0,
    hiddenName: true,
    currentId: 0,
    hides: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    swiperCurrent: 0,
    swiperCurrents: 0,
    hidden: true,
    load: '加载中...',
    tjhide: true,
    list:'',
    header: "",
    noncestr: '',
    childNav:'',
    packet:true,
    redpacket:true,
    imghide:true,
    up:'下拉加载更多~',
    id:'0',
    imgUrlss: [
      'http://oss.myzy.com.cn/wechat/images/img_sjzx_banner.png',
      'http://oss.myzy.com.cn/wechat/images/img_sjzx_banner.png',
    ],
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  swiperChanges: function (e) {
    this.setData({
      swiperCurrents: e.detail.current
    })
  },
  //跳转三级分类携参
  IndexSecond: function (e) {
    var texts = e.currentTarget.dataset.texts;
    wx.navigateTo({
      url: '../IndexThird/IndexThird?texte=' + texts,
    })
  },
  //天天抢钱
  Ronmoney(){
  wx.navigateTo({
    url: '../Robmoney/Robmoney',
  })
  },
  //  显示
  shows: function () {
    this.setData({
      hiddenName: false
    })
  },
  //关闭慕态框
  ClosePacket(){
    wx.showTabBar()
    this.setData({
      packet:true
    })
  },
  // 隐藏
  hide: function () {
    this.setData({
      hiddenName: true
    })
  },
 //搜索框跳转
  search(){
    let search_term = this.data.wxIndex.search_term;
    wx.navigateTo({
      url: '../Search/Search?search_term=' + search_term,
    })
  },
  //赠送商家入驻
  activity(){
    this.header(app.globalData.url +'activity');
    wx.request({
      url: app.globalData.url +'activity',
      method:'get',
      header:this.data.header,
      success:res=>{
        if(res.data.code == 200){
          wx.navigateTo({
            url: '../Comiss/Comiss',
          })
        }else{
          wx.setStorageSync('datas',res.data.data.callback)
          wx.navigateTo({
            url: '../jjb/jjb?data='+JSON.stringify(res.data.data.callback),
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannel();
    let share_queue_id = options.share_queue_id;
    this.setData({
      share_queue_id: share_queue_id
    })
    this.wxIndex();
    this.classify();
    this.goodsList(0,2,1);
    //获取元素宽高
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowWidth: res.windowWidth
        })
      },
    })
    let scene = app.globalData.scene;
    //有场景显示
    if (scene == 1036 || scene == 1037){
      if (share_queue_id >0 ){
        wx.hideTabBar();
        this.setData({
          packet: false
        })
      }else{
        this.setData({
          packet: true
        })
      }
    }else{
      this.setData({
        packet:true
      })
    }
    if (share_queue_id){
      this.praiseIndex(this.data.share_queue_id)
    } else {
      this.setData({
        packet: true
      })
    }
  },
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    var id = event.currentTarget.dataset.id;
    //每个tab选项宽度占1/5
    var singleNavWidth = (this.data.windowWidth - 84) / 6;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2.5) * singleNavWidth,
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
        id:id
      })
    }
    //首页第一个默认显示
    if (this.data.currentTab == 0) {
      this.setData({
        hides: false,
        tjhide: true
      })
    } else {
      this.setData({
        hides: true,
        tjhide: false
      })
    }
   //渲染数据
   if(cur!==0){
     this.setData({
       childNav:this.data.navData[cur]._child
     })
     this.goodsList(id, 2, 1);
   }else{
     this.goodsList(0, 2, 1);
   }
  },
  //点击每个导航的点击事件
  handleTap: function (event) {
    let id = event.currentTarget.id;
    var ids = event.currentTarget.dataset.ids;
    var singleNavWidth = (this.data.windowWidth - 84) / 6;
    if (id) {
      this.setData({
        currentId: id,
        hiddenName: true,
        currentTab: id,
        navScrollLeft: (id - 2.5) * singleNavWidth
      })
    }
    if (id == 0) {
      this.setData({
        hides: false,
        tjhide: true
      })
    } else {
      this.setData({
        hides: true,
        tjhide: false
      })
    }
    if(id!==0){
      this.setData({
        childNav: this.data.navData[id]._child
      })
      this.goodsList(ids, 2, 1);
    } else {
      this.goodsList(0, 2, 1);
    }

  },
  detail:function(e){
    let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '../Details/Details?id='+id,
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
  //获取首页数据
  wxIndex(){
    this.header(app.globalData.url + 'wxIndex');
    wx.request({
      url:app.globalData.url + 'wxIndex',
      method: 'GET',
      header: this.data.header,
      data:{
        client_type:3,
        client_version:'1.0.0'
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            wxIndex: res.data.data
          })
          app.store = res.data.data.store;
        }
      }
    })
  },
  //分类数据
  classify(){
    this.header(app.globalData.url + 'classify');
    wx.request({
      url: app.globalData.url + 'classify',
      method: 'GET',
      header: this.data.header,
      success: res => {
        if (res.data.code == 200) {
          let navs = [{id:0,name:'推荐'}];
          let nav = res.data.data.classify_list;
          for(let n = 0;n<nav.length;n++){
            for(let j =0;j< nav[n]._child.length;j++){
              navs.push(nav[n]._child[j])
            }
          }
          this.setData({
            navData:navs
          })
        }

      }
    })
  },
  //首页列表数据
  goodsList(classify_id, goods_type, now_page){
    this.header(app.globalData.url + 'goodsList');
    wx.request({
      url: app.globalData.url + 'goodsList',
      method: 'GET',
      header: this.data.header,
      data:{
        classify_id: classify_id,
        goods_type: goods_type,
        now_page:now_page
      },
      success: res => {
        if (res.data.code == 200) {
          if(res.data.data.goods_list<10){
            this.setData({
              up: '暂时没有更多内容了~'
            })
          }
            this.setData({
              listx: res.data.data.goods_list,
              pages: res.data.data.now_page,
            })
          }
        }
    })
  },
  //列表跳转
  navCour(e){
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let type = e.currentTarget.dataset.type;
    switch(name){
      //促销商品
      case "promotion":
        wx.navigateTo({
          url: '../Sale/Sale?type=' + type,
        })
        break;
      //赠送礼品
      case "gift":
      wx.navigateTo({
        url: '../Robmoney/Robmoney?type='+type,
      })
      break;
      //店铺页面
      case "store":
      wx.switchTab({
        url: '../CareShop/CareShop',
      })
      //web页面
        app.store_id = store_id;
      case "web":
      wx.navigateTo({
        // url: '../Webview/Webview?h5='+type,
        url:'../Factory/Factory',
      })
      break;
      case "market":
        let content = wx.getStorageInfoSync('content');
        if(!content){
            wx.navigateTo({
              url: '../jjb/jjb',
            })
        }
      this.activity()
        break;

      //优惠券
      case "coupon":
      wx.navigateTo({
        url: '../FreeConvert/FreeConvert',
      })
      break;
      //商品详情
      case "details":
      wx.navigateTo({
        url: '../Details/Details?id='+id,
      })
      break;
      //附近好店
      case "nearby":
      wx.navigateTo({
        url: '../Near/Near',
      })
      break;

    }
   
  },
  //模态框点击穿透事件
  move: function () { },
  //助力弹窗事件
  praiseIndex(share_queue_id){
    this.header(app.globalData.url +'praiseIndex')
    wx.request({
      url: app.globalData.url + 'praiseIndex',
      method:'get',
      header:this.data.header,
      data:{
        share_queue_id: share_queue_id
      },
      success:res=>{
        if(res.data.code == 200){
          let content = wx.getStorageSync('content');
          let progress =   
            Number(res.data.data.callback.share_queue.balance) / Number(res.data.data.callback.share_queue.activity_money)* 100;
          let left = 440 / 100 * Number(res.data.data.callback.share_queue.balance);
          let code = res.data.code;
          if(content){

          }else{
            res.data.data.callback.is_praise =0
          } 
            this.setData({
              share: res.data.data.callback,
              progress: progress,
              left: left
            })
        } else if (res.data.code == 402) {
          this.setData({
            packet: true,
          })
          wx.showTabBar();
          this.show(res.data.msg);
          setTimeout(function(){
            wx.navigateTo({
              url: '../Share/Share?num=' + res.data.data.callback.order_num + '&type=1',
            })
          },1000)
         
          }
          else{
            this.show(res.data.msg);
            this.setData({
              packet:true
            })
           wx.showTabBar();


        }
      }
    })
  },
  //点击为好友助力授权
  clickPraise(share_queue_id){
    this.header(app.globalData.url +'clickPraise');
    wx.request({
      url: app.globalData.url +'clickPraise',
      method:'POST',
      data:{
        share_queue_id:share_queue_id
      },
      header:this.data.header,
      success:res=>{
        if(res.data.code == 200){

          this.setData({
            red: res.data.data.callback,
            packet: true,
            redpacket:false,
          })
        }else{
          this.show(res.data.msg);
          this.setData({
            ['share.is_praise']:1
          })
          
        }
      }
    })
  },
  // 关闭红包
  redClose(){
    wx.showTabBar()
    this.setData({
      redpacket:true
    })
  },
  //判断有没有授权登录
  clickFalg(){
    let content = wx.getStorageSync('content');
    this.setData({
      content:content
    })
    //如果已登录
    if(content){
      this.clickPraise(this.data.share_queue_id)
    }else{
      this.bindGetUserInfo()
      this.clickPraise(this.data.share_queue_id)
    }
  },
  //获取授权信息
  bindGetUserInfo: function (e) {
    getApp().globalData.userInfo = e.detail;
    wx.setStorageSync('userInfo', e.detail);
    var referee_id = '';
    this.setData({
      userInfo: e.detail.userInfo
    })
    var userInfo = e.detail;
    userInfo.referee_id = referee_id;
    if (e.detail.userInfo) {
      wx.login({
        success: res => {
          var code = res.code;
          userInfo.code = code;
          wx.request({
            url: app.globalData.url + 'wxLogin',
            method: 'POST',
            header: app.globalData.header,
            data: {
              login_type: 2,
              client_type: 3,
              client_version: '1.0.0',
              oauth_data: JSON.stringify(userInfo)
            },
            success: res => {
              //返回值为401的情况下  未授权  跳转授权页面
              if (res.data.code == 401) {
                wx.removeStorageSync('content')
              } else if (res.data.code == 200) {
                //已登录情况下为2  后台获取到的信息渲染到页面上
                //生成header
                var uuid = res.data.data.uuid;
                var token = res.data.data.token;
                var expiry_time = res.data.data.expiry_time;
                //本地存储
                wx.setStorageSync('uuid', uuid);
                wx.setStorageSync('token', token);
                wx.getStorageSync('expiry_time', expiry_time);
                wx.setStorageSync('member_mall', res.data.data.member_mall);

                var timestamp = Date.parse(new Date());
                timestamp = timestamp / 1000;
                this.randomWord();
                var noncestr = this.data.noncestr;
                var api_url = app.globalData.url + 'user';
                var key = 'myzy3224326de100671291c7d1a6353ff6db';
                var arr = [api_url, key, this.data.noncestr, timestamp];
                var str = '';
                for (let i in arr) {
                  str += arr[i];
                }
                // md5加密生成
                var password = '';
                password = util.hexMD5(str);
                password = password.toUpperCase();
                wx.request({
                  url: app.globalData.url + 'user',
                  method: 'GET',
                  header: {
                    "sign": password,
                    "timestamp": timestamp,
                    "noncestr": noncestr,
                    "uuid": uuid,
                    "token": token,
                    "expirytime": expiry_time,
                    "request_type": 1,
                    "logintype": 2
                  },
                  success: res => {
                    if (res.data.code == 200) {
                      this.show('成功登录,点击助力')
                      wx.setStorage({
                        key: 'content',
                        data: res.data
                      })
                    } 

                  }
                })

              }
            }
          })
        }
      })
    } 
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let text = wx.getStorageSync('text');
    if (text) {
      this.show(text)
    }
    setTimeout(function(){
      wx.removeStorageSync('text')
    })
  },
  // 下拉加载
  // bindDownLoad(){
  //     let id = this.data.id;
  //     let page = this.data.now_page;
  //     page++;
  //     let goods_type = 2;
  //     this.goodsList(id,goods_type,page)
  // },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    var page = that.data.pages;
    let id = this.data.id;
    page ++;
    that.header(app.globalData.url + 'goodsList');
    wx.request({
      url: app.globalData.url + 'goodsList',
      method: 'GET',
      header: that.data.header,
      data: {
        classify_id:id,
        goods_type: 2,
        now_page: page
      },
      success: res => {
        if (res.data.code == 200) {
          let listx = that.data.listx;
          if (res.data.data.goods_list.length < 1){
            that.setData({
              up:'暂时没有更多内容了~'
            })
            wx.stopPullDownRefresh()
          }
          for (let x = 0; x < res.data.data.goods_list.length; x++) {
            if (res.data.data.goods_list.length >0){
              listx.push(res.data.data.goods_list[x])
              that.setData({
                listx: listx,
                pages: res.data.data.now_page
              })
            }
          }
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})