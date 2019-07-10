// pages/CareShop/CareShop.js
var util = require('../../utils/md5.js');
var app = getApp();
var utils = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    top:'',
    //收藏
    collect:'http://oss.myzy.com.cn/wechat/images/icon_sjzx_sc.png',
    datacol:'0',
    imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_h.png',
    dataindex:0,
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    }, 
    shopInfo:'',
    store_list:'',
    page:1,
    hidden: true,
    load: '加载中...',
    res:'',
    store_info:'',
    up:'下拉加载更多~'
  },
  tabFun: function (e) {
    //获取触发事件组件的dataset属性 
    var _datasetId = e.target.dataset.id;
    let mall_id = getApp().mall_id;
    if (typeof (mall_id) == 'undefined') {
      var store_id = 1;
    } else {
      var store_id = mall_id;
    }
    let now_page = 1;
    switch(_datasetId){
      // 综合
      case "0":
        this.getInfos(store_id,now_page,'');
        this.setData({
          keyword:''
        })
      break;
      // 新品
      case "1":
        this.getInfos(store_id, now_page,'asc_create_time');
        this.setData({
          keyword:'asc_create_time'
        })
        break;
      // 销量
      case "2":
        this.getInfos(store_id, now_page, 'desc_sales_volume');
        this.setData({
          keyword:'desc_sales_volume'
        })
        break;
    }
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj
    });
  }, 
  //跳转
  detail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../Details/Details?id=' + id,
    })
  },
  //点击收藏
  collect:function(e){
    // var col = e.target.dataset.col;
    var that = this;
    that.setData({
      collect: 'http://oss.myzy.com.cn/wechat/images/icon_sjzx_sch.png',
    })
    wx.showToast({
      title: '收藏成功',  //标题
      duration: 2000, //提示的延迟时间，单位毫秒，默认：1500
    })
  },
  // 价格排序
  changechoose:function(e){
    var index = e.target.dataset.index;
    let mall_id = getApp().mall_id;
    if (typeof (mall_id) == 'undefined') {
      var store_id = 1;
    } else {
      var store_id = mall_id;
    }
    let now_page = 1;
    index ++;
    var that = this;
    if(index == 1){
      that.getInfos(store_id, now_page, 'asc_price');
      
      that.setData({
        dataindex: index,
        imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_s.png'
      })
    }else if(index == 2){
      that.getInfos(store_id, now_page, 'desc_price');
      that.setData({
        keyword:'desc_price',
        dataindex: index,
        imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_x.png'
      })
    }else{
      that.getInfos(store_id, now_page, 'asc_price');
      that.setData({
        keyword:'asc_price',
        dataindex: 1,
        imageurl2: 'http://oss.myzy.com.cn/wechat/images/icon_xq_s.png'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let mall_id = getApp().mall_id;
    let Tname = app.globalData.Tname;
    let phone = wx.getStorageSync('telephone');
    let telephone_tip = wx.getStorageSync('telephone_tip');
    this.setData({
      Tname: Tname,
      phone:phone,
      telephone_tip:telephone_tip
    })
    if (typeof (mall_id) =='undefined'){
      this.setData({
        store_id: '',
        keyword:'',
      })
    }else{
      var  store_id = mall_id;
      this.setData({
        store_id: store_id,
      })
    }
    let now_page = 1;
    let keyword = '';
    this.setData({
      now_page:now_page,
    })
    this.getShop(store_id);
    this.getInfo()
    var shopInfo = wx.getStorageSync('shopInfo');
    this.setData({
      shopInfo:shopInfo,
      keyword:'',
      store_list:''
    })
  },
  scrollTopFun(e) {
    var top = e.detail.scrollTop;
    var that = this;
    that.setData({
      top:top
    })
  },
  //惠小店列表获取
  getInfo(store_id, now_page, keyword){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url+'getStoreList');
    var  store_id = this.data.store_id;
    if(store_id){
      wx.request({
        url:app.globalData.url+'getStoreList',
        method: 'GET',
        header: this.data.header,
        data:{
          store_id: store_id,
          now_page:1,
          keyword: ''
        },  
        success: res => { 
          this.setData({
            isShow:false
          })
          if(res.data.code == 200){
                   let store_list = this.data.store_list;
      
                   if(store_list){
                       for (let x = 0; x < res.data.data.store_list.length; x++) {
                         if (res.data.data.store_list.length > 0) {
                         store_list.push(res.data.data.store_list[x]);
                           var obj = {},
                          //  reduce去重  
                           store_list = store_list.reduce((cur, next)=>{
                             obj[next.goods_id] ? "" : obj[next.goods_id] = true && cur.push(next);
                             return cur;
                           },[])
                           console.log(store_list)
                         this.setData({
                           store_list: store_list,
                           pages: res.data.data.now_page,
                           up: '下拉加载更多~'
                         })
                       }
                     }
                   }else{
                     
                     this.setData({
                        store_list:res.data.data.store_list,
                       pages: res.data.data.now_page,
                       up:'暂时没有更多内容了~'
                     })
                   }
                   
              
          }else{
            utils.error(res);
          }
        }
      })

    }else{
      var now_page = this.data.now_page;
      wx.request({
        url:app.globalData.url+'getStoreList',
        method: 'GET',
        header: this.data.header,
        data:{
          now_page:now_page,
          keyword: ''
        },  
        success: res => { 
          this.setData({
            isShow:false
          })
          if(res.data.code == 200){
                   let store_list = this.data.store_list;
      
                   if(store_list){
                       for (let x = 0; x < res.data.data.store_list.length; x++) {
                         if (res.data.data.store_list.length > 0) {
                         store_list.push(res.data.data.store_list[x]);
                           var obj = {},
                          //  reduce去重  
                           store_list = store_list.reduce((cur, next)=>{
                             obj[next.goods_id] ? "" : obj[next.goods_id] = true && cur.push(next);
                             return cur;
                           },[])
                         this.setData({
                           store_list: store_list,
                           pages: res.data.data.now_page,
                           up: '暂时没有更多内容了~'
                         })
                       }
                     }
                   }else{
                     this.setData({
                        store_list:res.data.data.store_list,
                           pages: res.data.data.now_page,
                       up:'下拉加载更多~'
                     })
                   }
                   
              
          }else{
            utils.error(res);
          }
        }
      })
    }
   
  },
  //排序
  getInfos(store_id, now_page, keyword) {
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url + 'getStoreList');
    var  store_id = this.data.store_id;
    if(store_id){
      wx.request({
        url: app.globalData.url + 'getStoreList',
        method: 'GET',
        header: this.data.header,
        data: {
          store_id: store_id,
          now_page: now_page,
          keyword: keyword
        },
        success: res => {
          this.setData({
            isShow:false
          })
          if (res.data.code == 200) {
              this.setData({
                store_list: res.data.data.store_list
              })
          } else {
            utils.error(res);
          }
        }
      })
}else{
  wx.request({
    url: app.globalData.url + 'getStoreList',
    method: 'GET',
    header: this.data.header,
    data: {
      now_page: now_page,
      keyword: keyword
    },
    success: res => {
      this.setData({
        isShow:false
      })
      if (res.data.code == 200) {
          this.setData({
            store_list: res.data.data.store_list
          })
      } else {
        utils.error(res);
      }
    }
  })
}
    
  },
  //惠小店店铺信息
  getShop(store_id){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url+'store');
    var  store_id = this.data.store_id;
    if(store_id){
      wx.request({
        url:app.globalData.url+'store',
        method: 'GET',
        header:this.data.header,
        
        data:{
          store_id:store_id
        },
        success: res => {
          this.setData({
            isShow:false
          })
          if (res.data.code == 200) {
           this.setData({
             store_info:res.data.data
           })
          }else{
            utils.error(res);
          }
        }
      })
    }else{
      wx.request({
        url:app.globalData.url+'store',
        method: 'GET',
        header:this.data.header,
        success: res => {
          if (res.data.code == 200) {
           this.setData({
             store_info:res.data.data
           })
          }else{
            utils.error(res);
          }
        }
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
  //拨打电话
  calling: function (e) {
    // var phone = e.currentTarget.dataset.phone;
    let phone = wx.getStorageSync('telephone');
    wx.makePhoneCall({
      phoneNumber:phone, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },
  //上拉加载
  // bindDownLoad(){
  //   let page = this.data.now_page;
  //   page++;
  //   console.log(page)
  //   let keyword = this.data.keyword;
  //   let store_id = this.data.store_id;
  //   this.getInfo(store_id,page,keyword)
  // },
  onReachBottom: function () {
    let that = this;
      var page = that.data.pages;
    page++;

      let store_id = this.data.store_id;
      if(store_id){
        var data={
          store_id: store_id,
          now_page:page
        }
      }else{
        var data={
          now_page:page
        }
      }
    that.header(app.globalData.url + 'getStoreList');
    wx.request({
      url: app.globalData.url + 'getStoreList',
      method: 'GET',
      header: that.data.header,
      data: data,
      success: res => {
        if (res.data.code == 200) {
          let listx = that.data.store_list;
          if (res.data.data.store_list.length < 1) {
            that.setData({
              up: '暂时没有更多内容了~'
            })
            wx.stopPullDownRefresh()
          }
          for (let x = 0; x < res.data.data.store_list.length; x++) {
            if (res.data.data.store_list.length > 0) {
              listx.push(res.data.data.store_list[x])
              that.setData({
                store_list: listx,
                pages: res.data.data.now_page
              })
            }
          }
        }
      }
    })
  },
})