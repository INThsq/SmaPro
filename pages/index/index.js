var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp();
var w = "";
var h = "";
const ImgLoader = require('../../public/img-loader/img-loader.js')

// pages/UserCenter/userCenter.js
Page({
  /**
   * 页面的初始数据
   */
  //商家中心
  data: {
    score: 25,
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
    autoplay: false,
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
 //点击跳转消息
  More(){
      let id =this.data.wxIndex.more_notice;
      let content = wx.getStorageSync('content')
      if(content){
        wx.navigateTo({
          url:'../NewsCont/NewsCont?id='+id
        })
      }else{
        wx.navigateTo({
          url:'../Accredit/Accredit'
        })
      }
     
  },

  //跳转三级分类携参
  IndexSecond: function (e) {
    var texts = e.currentTarget.dataset.texts;
    var id = e.currentTarget.dataset.id;
    this.goodsList(id,1,1)
    wx.navigateTo({
      url: '../IndexThird/IndexThird?texte=' + texts + '&id=' + id + '&navData=' + JSON.stringify(this.data.navData) + '&currentTab=' + this.data.currentTab +'&listx='+ JSON.stringify(this.data.listx),
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
  // 分销中心
  distribution(member_mall_id) {
    var scenes = 0;
    var data = {};
    switch (scenes) {
      // 非订单验证
      case 0:
        data = {
          scene: 0,
          order_num: '',
          goods_id: 0,
          member_mall_id: 0
        }
        break;
      // 订单验证
      case 1:
        let goods_id = this.data.goods_id;
        let mall_goods_id = this.data.mall_goods_id;
        let order_num = this.data.order_num;
        data = {
          scene: 1,
          goods_id: goods_id,
          mall_goods_id: mall_goods_id,
          order_num: order_num
        }
        break;
    }
    this.header(app.globalData.url + 'distribution');
    wx.request({
      url: app.globalData.url + 'distribution',
      header: this.data.header,
      method: 'get',
      data: data,
      success: res => {
        if (res.data.code == 200) {
          wx.setStorageSync('data',data)
          app.data = data
          wx.navigateTo({
            url: '../FyCenter/FyCenter?top=' + JSON.stringify(res.data.data.callback)
          })

        }else{
          this.show(res.data.msg)
        }
      }
    })
  },
  //赠送商家入驻
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
  //门店管理
  switchDotCenter(){
    let content = wx.getStorageSync('content');
    if(content){
      this.header(app.globalData.url + 'switchDotCenter');
      wx.request({
        url: app.globalData.url + 'switchDotCenter',
        method: 'get',
        header: this.data.header,
        success: res => {
            if(res.data.code == 200){
                if(res.data.data.callback.length <1){
                  this.show('您还未开通相关门店,请前去开通或联系客服')
                }else{
                  this.dotCenter(res.data.data.callback[0].mall_dot_authorize_id, res.data.data.callback[0].order_num)
                  setTimeout(function(){
                    wx.navigateTo({
                      url: '../WhitCenter/WhitCenter?list=' + JSON.stringify(res.data.data.callback),
                    })
                  },500)
                  
                }
             
            }else if(res.data.code == 401){
              this.show(res.data.msg)
            }else{
              this.show(res.data.msg)
              wx.navigateTo({
                url: '/pages/Accredit/Accredit'
              })
            }
        }
      })
    }
   
  },
  dotCenter(mall_dot_authorize_id, order_num) {
    this.header(app.globalData.url + 'dotCenter');
    wx.request({
      url: app.globalData.url + 'dotCenter',
      header: this.data.header,
      method: 'get',
      data: {
        mall_dot_authorize_id: mall_dot_authorize_id,
        order_num: order_num
      },
      success: res => {
        if(res.data.code == 200){
          app.top = res.data.data.callback
          wx.setStorageSync('top', res.data.data.callback)
        }else if(res.data.code == 401){
          this.show(res.data.msg)
        }else{
          this.show(res.data.msg)
          wx.navigateTo({
            url: '/pages/Accredit/Accredit'
          })
        }
     
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      Tname: app.globalData.Tname
    })
    this.setData({
      autoplay:true
    })
    new app.ToastPannel();
    let share_queue_id = options.share_queue_id;
    if (share_queue_id){
      this.setData({
        share_queue_id: share_queue_id
      })
    }
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
    let that = this;
    let allSrc = 0.015 * that.data.score; //应该绘制的弧度
    let src = allSrc / 100
    that.setData({
      src: src,
      allSrc: allSrc
    })
  },
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    var id = event.currentTarget.dataset.id;
    //每个tab选项宽度占1/5
    var singleNavWidth = (this.data.windowWidth) / 6;
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
  onHide: function () {
    this.setData({
      swiperCurrent:0,
      autoplay:false
    })
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
          app.cookie = res.header['Set-Cookie'];
          wx.setStorageSync('cookie',res.header['Set-Cookie']);
          wx.setStorageSync('bg', res.data.data.background)
          if (res.data.data.application.length>5){
            this.setData({
              imgUrlss: [
                'http://oss.myzy.com.cn/wechat/images/img_sjzx_banner.png',
                'http://oss.myzy.com.cn/wechat/images/img_sjzx_banner.png',
              ],
            })
          }else{
            this.setData({
              imgUrlss: [
                'http://oss.myzy.com.cn/wechat/images/img_sjzx_banner.png'
              ],
            })
          }
          
          this.setData({
            wxIndex: res.data.data,
            Banner:res.data.data.banner
          })
          wx.setStorageSync('telephone',res.data.data.telephone)
          wx.setStorageSync('telephone_tip', res.data.data.telephone_tip)

          app.phone = res.data.data.telephone;
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
        this.setData({
          isShow:false
        })
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
  navCour:utils.throttle(function (e){
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
        app.store_id = store_id;
        break;
      //web页面
      case "web":
      wx.navigateTo({
        url: '../Webview/Webview?h5=' + type,
      }) 
      break;
      //优惠券兑换
      case "coupon":
        wx.navigateTo({
          url: '../FreeConvert/FreeConvert',
        })
        break;
      //商品详情
      case "details":
        wx.navigateTo({
          url: '../Details/Details?id=' + id,
        })
        break;
      // 厂家促销 
      case "factory":
      wx.navigateTo({
        url:'../Factory/Factory',
      })
      break;
      //商品兑换
      case "convert":
      break;
      //活动申请
      case "market":
        let content = wx.getStorageInfoSync('content');
        if(!content){
            wx.navigateTo({
              url: '../jjb/jjb',
            })
        }
        this.activity(type)
        break;
      //附近门店
      case "nearby":
      wx.navigateTo({
        url: '../Near/Near',
      })
      break;
      //门店管理
      case "malldot":
        this.switchDotCenter();
        break;
      //销售管理中心
      case "sale":
      break;
      //促销商家 
      case "merchant":
        var content = wx.getStorageSync('content');
        if(content){
          wx.navigateTo({
            url: '../Comiss/Comiss',
          });
        }else{
          wx.navigateTo({
            url: '../Accredit/Accredit',
          });
        }
       break; 
       //礼品详情
       case "givegift":
       let id = e.currentTarget.dataset.gift;
       wx.navigateTo({
         url:'../RobDeatail/RobDeatail?id='+type
       }) 
       break;
       //跳转微信提现
       case "wechat":
       var content = wx.getStorageSync('content');
       let jump = e.currentTarget.dataset.jump;
       if(content){
        wx.navigateTo({
          url: '../Deposit/Deposit?jump='+type,
        });
      }else{
        wx.navigateTo({
          url: '../Accredit/Accredit',
        });
      }
      break;
      //跳转实名认证
      case "realname":
      var content = wx.getStorageSync('content');
      if(content){
        wx.navigateTo({
          url: '../Certification/Certification',
        });
      }else{
        wx.navigateTo({
          url: '../Accredit/Accredit',
        });
      }   
      break;   
      //跳转8800开通页面
    
      case "enterdot":
      wx.navigateTo({
        url:"../JiujiaB/JiujiaB?id="+ e.currentTarget.dataset.type
      })
      break;
    }
  },1000),
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
 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReady: function () {
  },
  onPullDownRefresh(){
    wx.stopPullDownRefresh;
  },
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
              listx.forEach(item => {
                this.imgLoader.load(item.goods_image)
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