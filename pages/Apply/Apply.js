// pages/ZtApply/Apply.js
var app = getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js'); 
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: '4IOBZ-P77KI-DFEG5-5JCRB-FTFGQ-RAFIY' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuTapCurrent: '0',
    type: 3,
    isShowText: false, //控制显示 textarea 还是 text

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannels();
    let member_mall_id = options.member_mall_id;
    let money = options.money;
    let name = options.name;
    let telephone = options.telephone;
    let account_balance = options.account_balance;
    this.setData({
      member_mall_id:member_mall_id,
      money:money,
      name:name,
      telephone:telephone,
      account_balance:account_balance
    })
    
  },
  onRemarkInput(event) {               //保存输入框填写内容
    var value = event.detail.value;
    this.setData({
      local: value,
    });
  },
  onShowTextare() {       //显示textare
    this.setData({
      isShowText: false,
      onFacus: true
    })
  },
  //选择位置
  chooseLocation: function (e) {
    var that = this
    wx.chooseLocation({
      success(res){
        let loca = res.address+' '+res.name;
        let latitude = res.latitude;
        let longitude = res.longitude;
        that.setData({
          pois_address:res.address,
          pois_title:res.name,
          local: loca,
          latitude:latitude,
          longitude:longitude
        })
        qqmapsdk.reverseGeocoder({
          location:{
            latitude: latitude,
            longitude: longitude
          },
          get_poi:0,
          success:res=>{
              that.setData({
                province: res.result.ad_info.province,
                city: res.result.ad_info.city,
                district: res.result.ad_info.district
              })
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
  //获取手机号
  inputDataChenge(e){
    let moblie = e.detail.value;
    this.setData({
      moblie:moblie
    })
  },
  //提交验证
  Open(){
    //商铺名称
    let dot_name = this.data.dot_name;
    //手机号
    let telephone = this.data.telephone;
    if(telephone.length != 11){
        this.shows('请输入11位合法手机号')
    }else if(dot_name >=15){
       this.shows('店铺名称不能超过15字')
    }else{
      this.showModal();
    }
  },
  //支付
  topay(){
    //商铺名称
    let dot_name = this.data.dot_name;
    //手机号
    let telephone = this.data.telephone;
    let member_mall_id = this.data.member_mall_id;
    let money = this.data.money;
    //经纬度
    let lnglat = this.data.longitude + ',' + this.data.latitude;
    //联级地址
    let location_address = this.data.province + this.data.city + this.data.district;
    //介绍
    let pois_title = this.data.pois_title;
    let pois_address = this.data.pois_address;
    //支付方式
    let pay_type = this.data.type;
    this.applyDot(member_mall_id, money, dot_name, telephone, lnglat, location_address, pois_title, pois_address, pay_type);
  },
  //商家名称
  inputDotName(e){
    let dot_name = e.detail.value;
    this.setData({
      dot_name:dot_name
    })
  },
  //联系电话
  inputTel(e){
    let telephone = e.detail.value;
      this.setData({
        telephone: telephone
      })
  },
  //关闭模态框
  close(){
    this.hideModal();
  },
  //自提点申请
  applyDot(member_mall_id, money, dot_name, telephone, lnglat, location_address, pois_title, pois_address, pay_type){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url +'applyDot');
    wx.request({
      url: app.globalData.url +'applyDot',
      header:this.data.header,
      method:'post',
      data:{
          member_mall_id:member_mall_id,
          money:money,
          dot_name:dot_name,
          telephone:telephone,
          lnglat:lnglat,
          location_address:location_address,
          pois_title:pois_title,
          pois_address:pois_address,
          pay_type:pay_type
      },
      success:res=>{
        this.setData({
          isShow:false  
        })
        if(res.data.code == 200){
          this.shows(res.data.msg);
          wx.navigateTo({
            url: '../Near/Near',
          })
        }else if(res.data.code == 401){
            this.shows(res.data.msg)
          }else{
          this.shows(res.data.msg);
          wx.navigateTo({
            url: '../Accredit/Accredit',
          })
        }
      }
    })
  },

  //选择类型
  menuTap: function (e) {
    var current = e.currentTarget.dataset.current;//获取到绑定的数据
    var type = e.currentTarget.dataset.type;
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrent: current,
      type: type
    });
    var chooseAddress = wx.getStorageSync('chooseAddress');

  },
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
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