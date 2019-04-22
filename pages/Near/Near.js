// pages/Near/Near.js
var app = getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js'); 
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
let key = getApp().key;
var qqmapsdk = new QQMapWX({
  key: '4IOBZ-P77KI-DFEG5-5JCRB-FTFGQ-RAFIY' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
        latitude:'',
        longitude:'',
        del:true,
        pro:true,
        isShow:true,
        before:true,
        region_city:'定位中 ...',
        
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannels();
    this.getLocation();
    this.switchLocale();
  },
  back(){
    let jjb = getApp().jjb;
    if(jjb==1){
      wx.switchTab({
        url: '../index/index',
      })
      app.jjb=0
    }else{
      wx.navigateBack({
        delta:1
      })
    }
  } ,   
  //选择地址显示
  ChooseProvince(){
    this.setData({
      pro:false
    })
  },
  //关闭模态框
  CloseModal(){
    this.setData({
      pro:true
    })
  },
  //获取input 内值
  keyword(e) {
    let val = e.detail.value;
    if (val.length > 0) {
      this.setData({
        del: false,
        searchValue:val
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
  del(){
      this.setData({
        searchValue:'',
        del:true
      })
  },
  //选择位置位置
  chooseLocation: function (e) {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        // success
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
  calling(e){
		let phone =e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber:phone, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
					this.shows('电话号码有误')
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.Modal = this.selectComponent("#modal");
  },
  //位置授权
  getUserLocation(){
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API

                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          this.getUserLocation();
        }
        else {
          this.getLocation();
          //调用wx.getLocation的API
          this.getUserLocation();
        }
      }
    })
  },
  //微信获取经纬度
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        let lnglat = longitude +','+latitude;
        that.setData({
          latitude:latitude,
          longitude:longitude,
          lnglat:lnglat
        })
        that.position(lnglat);
      },
      fail(res){
      }
    })
  },
  //获取当前定位城市
  position(lnglat){
    this.setData({
      isShow:true
    })
    let that = this;
    var  lnglat = that.data.lnglat;
    let now_page = 1;
    let keywords ='';
    that.header(app.globalData.url +'position');
    let cookie = getApp().cookie;
    let header = that.data.header;
    if (cookie) {
      header.Cookie = cookie;
    }
    wx.request({
      url: app.globalData.url +'position',
      header:that.data.header,
      method:'get',
      data:{
        lnglat: lnglat
      },
      success:res=>{
        this.setData({
          isShow:false
        })
        if(res.data.code == 200){
          console.log(res.data.data)
          let region_id = res.data.data.callback.region_id;
          let region_city = res.data.data.callback.region_city;
          let local = res.data.data.callback;
          if(local.area != null){
            this.setData({
              local: local.area
            })
          } else if (local.poi != null){
              this.setData({
                local: local.poi
              })
          } else if (local.town != null) {
            this.setData({
              local: local.town
            })
          } else if (local.village != null) {
            this.setData({
              local: local.village
            })
          }else{
            this.setData({
              local: local.region_city
            })
          }
          this.mallDotList(region_id, region_city, lnglat, now_page, keywords)
          that.setData({
            before:false,
            region: res.data.data.callback,
            region_city: res.data.data.callback.region_city,
            region_id: res.data.data.callback.region_id
          })
        }
      }
    })
  },
  //获取自提点列表
  mallDotList(region_id, region_city,lnglat,now_page,keywords){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url +'mallDotList');
    let cookie = getApp().cookie;
    let header = this.data.header;
    if (cookie) {
      header.Cookie = cookie;
    }
    wx.request({
      url: app.globalData.url +'mallDotList',
      method:'get',
      header:this.data.header,
      data:{
        region_id:region_id,
        region_city:region_city,
        lnglat:lnglat,
        now_page:now_page,
        keywords:keywords
      },
      success:res=>{
        this.setData({
          isShow: false,
          mall_dot_list: res.data.data.callback.mall_dot_list
        })
      }
    })
  },
  //获取城市列表
  switchLocale(){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.urls +'switchLocale');
    wx.request({
      url: app.globalData.urls +'switchLocale',
      method:'get',
      header:this.data.header,
      success:res=>{
        this.setData({
          isShow:false
        })
          this.setData({
            cityList: res.data.data.switch_locale
          })
      }
    })
  },
  //搜索位置
  searchSubmitFn: function (e) {
   let that = this;
    let keywords = e.detail.value;
    let region_id = that.data.region_id;
    let region_city = that.data.region_city;
    var lnglat = that.data.lnglat;
    let now_page = 1;
    that.mallDotList(region_id, region_city, lnglat, now_page, keywords)
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
  //切换标识
  Cur(e){
    let cur = e.target.dataset.cur;
    let id = e.target.dataset.id;
    let city = e.target.dataset.city;
    this.setData({
      cur:cur,
      region_city:city
    })
    this.mallDotList(id,city,'',1,'')
    this.setData({
      pro: true
    })
  }

})