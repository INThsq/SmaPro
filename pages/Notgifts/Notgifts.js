// pages/Notgift/Notgift.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    currentTabs: 0,
    page:1
  },
  //返回监听
  back(){
    let gift_praise_type = this.data.gift_praise_type;
    let curs = this.data.curs;
    let tab = this.data.tab;
    if(gift_praise_type == 1){
      if(curs){
        this.setData({
          currentTabs:curs
        })
        wx.switchTab({
          url: '../UserCenter/userCenter',
        })
      }else{
        wx.navigateBack({
          delta:1
        })
      }
      }else{
      wx.switchTab({
        url: '../UserCenter/userCenter',
      })
    }
   
  },
  backs(){
    wx.navigateBack({
      delta:3
    })
  },
  //获取提货凭证
  Voucher(e){
    let scene_type = e.currentTarget.dataset.id;
    let scene_status = e.currentTarget.dataset.statu;
    let order_num = e.currentTarget.dataset.order;
    let dot_num = e.currentTarget.dataset.dot;
    this.giftHandlings(scene_type,scene_status,order_num,dot_num)
  },
 //页面加载
 onLoad(options){
  new app.ToastPannels();
   let gift_praise_type = options.gift;
   var page = this.data.page;
   let tab = options.tab
   if(gift_praise_type){
     this.setData({
       gift_praise_type: gift_praise_type,
     })
   }
   
   if(gift_praise_type == 1){
     let curs = options.curs;
     let tab =options.tab;
     if(tab){
       this.setData({
         curs:curs,
         tab:tab,
          gift_praise_type:3
       })
     }
     if(curs){
       this.setData({
        clickTabs:curs,
        currentTabs:tab,
       })
       this.giveList(curs,page)
     }else{
     this.giveList(-1,page)
     }
   }else{
     let cur = options.cur;
    
     if (cur) {
       this.setData({
         currentTab: 1,
         cur: cur
       })
       this.unclaimed(cur,page)
     } else {
       this.unclaimed(-1,page)
     }
   }
 },
 
 //下拉刷新
 onReachBottom: function () {
    let page = this.data.page;
    page++;
    let gift_praise_type = this.data.gift_praise_type;
    if(gift_praise_type == 1){
      let curs = this.data.curs;
      if(curs){
        this.giveList(curs, page)
      }else{
        this.giveList(-1,page)
      }
    }else{
      let cur = this.data.cur;
      if(cur){
        this.unclaimed(cur, page)
      }else{
        this.unclaimed(-1,page)
      }

    }
 },
 //上传核销
 Upload(e){
  let scene_type = e.currentTarget.dataset.id;
  let scene_status = e.currentTarget.dataset.statu;
  let order_num = e.currentTarget.dataset.order;
  wx.navigateTo({
      url:'../Query/Query?scene_type='+scene_type+'&scene_status='+scene_status+'&order_num='+order_num
  })
 },
  //取货凭证获取
  proofList(scene_num) {
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url + 'proofList');
    wx.request({
      url: app.globalData.url + 'proofList',
      method: 'get',
      header: this.data.header,
      data: {
        dot_num: scene_num,
      },
      success: res => {
        this.setData({
          isShow: false
        })
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '../Voucher/Voucher?scene_num=' + scene_num
          })
        } else if (res.data.code == 401) {
          wx.navigateTo({
            url: '../NoQuery/NoQuery?error=' + JSON.stringify(res.data) + '&scene_num=' + scene_num
          })
        } else {
          this.shows(res.data.code)
        }
      }
    })
  },
 //获取列表
  unclaimed(praise_status, now_page){
    this.setData({
      isShow: true
    })
    this.header(app.globalData.url +'unclaimed');
    wx.request({
      url: app.globalData.url +'unclaimed',
      header:this.data.header,
      method:'get',
      data:{
        praise_status:praise_status,
        now_page:now_page
      },
      success:res=>{
        this.setData({
          isShow: false
        })
        if(res.data.code ==200){
          let gift_praise_list = res.data.data.callback.gift_praise_list;

          if (now_page == 1){
            this.setData({
              gift_praise_list: res.data.data.callback.gift_praise_list,
              gift_praise_type: res.data.data.callback.gift_praise_type,
              page:res.data.data.callback.now_page
            })
          }else if(res.data.data.callback.gift_praise_list.length == 0){
              return false;
              console.log('ddd')
          }else{
            console.log('sss')
            const list = res.data.data.callback.gift_praise_list.map(item=>{
                gift_praise_list.push(item)
            })
            this.setData({ gift_praise_list }) 
          }
          
        }
      }
    })  
  },
  //未领取投诉
  NoRec(e){
    this.Modal.showModal();
    let scene_type = e.currentTarget.dataset.id;
    let scene_status = e.currentTarget.dataset.statu;
    let order_num = e.currentTarget.dataset.order;
    let dot_num = e.currentTarget.dataset.dot;
    let index = e.currentTarget.dataset.index;
    console.log(index)
    this.setData({
      index:index,
      scene_type:scene_type,
      scene_status:scene_status,
      order_num:order_num,
      dot_num:dot_num
    })
  },
  //确认未投诉
  _confirmEventFirst(){
    let scene_type = this.data.scene_type;
    let scene_status = this.data.scene_status;
    let order_num = this.data.order_num;
    let dot_num = this.data.dot_num;
    this.giftHandling(scene_type,scene_status,order_num,dot_num)
    this.Modal.hideModal();
  },
  //取消投诉
  _cancelEvent(){
    this.Modal.hideModal();
    
  },
  
  Revoke(e){
    this.Modals.showModal();
    let scene_type = e.currentTarget.dataset.id;
    let scene_status = e.currentTarget.dataset.statu;
    let order_num = e.currentTarget.dataset.order;
    let dot_num = e.currentTarget.dataset.dot;
    let index = e.currentTarget.dataset.index;
    this.setData({
      scene_type:scene_type,
      scene_status:scene_status,
      order_num:order_num,
      dot_num:dot_num,
      index:index
    })
  },
  //确认未投诉
  confirm(){
    let scene_type = this.data.scene_type;
    let scene_status = this.data.scene_status;
    let order_num = this.data.order_num;
    let dot_num = this.data.dot_num;
    this.giftHandling(scene_type,scene_status,order_num,dot_num)
    this.Modals.hideModal();
  },
  //取消投诉
  cancel(){
    this.Modals.hideModal();
  },

  //分销商列表
  giveList(praise_status, now_page){
    let tab = this.data.tab;
    this.header(app.globalData.url + 'giveList');
    wx.request({
      url: app.globalData.url + 'giveList',
      header: this.data.header,
      method: 'get',
      data: {
        praise_status: praise_status,
        now_page: now_page
      },
      success: res => {
        if (res.data.code == 200) {
         
            this.setData({
              gift_praise_type:res.data.data.callback.gift_praise_type
            })
          let gift_praise_list = res.data.data.callback.gift_praise_list;
          this.setData({
            gift_praise_list: res.data.data.callback.gift_praise_list
          })
        }
      }
    })  
  },
  //点击到网点查询
  Query(e){
    let order = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../Query/Query?order='+order,
    })
  },
  //未领取投诉
  giftHandling(scene_type,scene_status,order_num,dot_num){
    let gift_praise_list = this.data.gift_praise_list;
    let index = this.data.index;
    this.header(app.globalData.url+'giftHandling');
    wx.request({
      url:app.globalData.url+'giftHandling',
      header:this.data.header,
      method:'POST',
      data:{
        scene_type:scene_type,
        scene_status:scene_status,
        order_num:order_num,
        dot_num:dot_num
      },
      success:res=>{
          this.shows(res.data.msg)
          gift_praise_list.splice(index,1)
          this.setData({
            gift_praise_list:gift_praise_list
          })
      }
    })
  },
  giftHandlings(scene_type,scene_status,order_num,dot_num){
    this.header(app.globalData.url+'giftHandling');
    wx.request({
      url:app.globalData.url+'giftHandling',
      header:this.data.header,
      method:'POST',
      data:{
        scene_type:scene_type,
        scene_status:scene_status,
        order_num:order_num,
        dot_num:dot_num
      },
      success:res=>{
          this.shows(res.data.msg)
          wx.navigateTo({
            url:'../Voucher/Voucher'
          })
          app.callback = res.data.data.callback
          
      }
    })
  },
  //初始化
  onReady: function () {
    this.Modal = this.selectComponent("#modal");
    this.Modals = this.selectComponent("#modals");
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    var currentTab = e.target.dataset.current;
    var id = e.currentTarget.dataset.id;
    var page = this.data.page;
    that.unclaimed(id,page)
    if (this.data.currentTab === currentTab) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        id:id
      })
    }
  },
  clickTabs(e){
      var that = this;
      var currentTabs = e.target.dataset.currents;
      var id = e.currentTarget.dataset.id;
      var page = this.data.page;
      that.giveList(id,page)
      if (this.data.currentTabs === currentTabs) {
        return false;
      } else {
        that.setData({
          currentTabs: e.target.dataset.currents,
          ids:id
        })
      }
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
      var session_id = wx.getStorageSync('session_id');
      var header = {
        "sign": password,
        "timestamp": timestamp,
        "noncestr": noncestr,
        "uuid": uuid,
        "token": token,
        "expirytime": expiry_time,
        "logintype": logintype,
        "Cookie": session_id
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