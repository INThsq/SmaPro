// pages/UserCenter/userCenter.js
var util = require('../../utils/md5.js')
var utils = require('../../utils/util.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    autoplay: true,
    interval: 5000,
    duration: 1000,
    swiperCurrent: 0,
    member_mall: '',
    res: '',
    menuTapCurrents: '',
    pay_type: 3,
    type:1,
    isShow:false
  },
  back(){
    let m = this.data.member_mall;
    if(m){
      wx.switchTab({
        url:'../UserCenter/userCenter'
      })
    }
  },
//跳转
  ShopMan(){
    wx.navigateTo({
      url: '../ShopMan/ShopMan',
    })
  },
  ShopGl(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../ShopGl/ShopGl?id='+id,
    })
  },
  FanNum(){
    wx.navigateTo({
      url: '../VipNum/VipNum',
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //获取页面数据
  getJson() {
    var that = this;
    that.setData({
      isShow: true,
    })
    that.header(app.globalData.url + 'setStore');
    wx.request({
      url: app.globalData.url + 'setStore',
      method: 'GET',
      header: that.data.header,
      success: res => {
        this.setData({
          isShow:false
        })
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '../OpenShop/OpenShop?res=' + JSON.stringify(res.data),
          })
        }else if(res.data.code == 401){
          this.shows(res.data.msg)
        } else {
              utils.error(res);
        }
      }
    })
  },
  //商家中心
  income: function () {
    wx.navigateTo({
      url: '../SettedEarn/SettedEarn',
    })
  },

  //选择支付方式
  setted(e){
    this.showModal();
    wx.hideTabBar();
  },
  //关闭慕态框
  close: function () {
    this.hideModal();
    wx.showTabBar();
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
  //预览跳转
  prevViwe(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../GoodShop/GoodShop?id='+id,
    })
  },
  // 选择支付方式
  menuTaps: function (e) {
    var current = e.currentTarget.dataset.current;//获取到绑定的数据
    var pay_type = e.currentTarget.dataset.pay;
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrents: current,
      pay_type: pay_type
    });
  },
  //支付
  topay(e){
    let pay_type = this.data.pay_type;
    let total_fee = e.target.dataset.pay;
    let money = wx.getStorageSync('money');
    let type = 1;
    money = money.replace(",","");
    if (Number(money)>1000){
      type =1;
    }else{
      type =3;
    }
    if(pay_type == 1){
      this.renewContractFree(total_fee,pay_type,type)
    }else{
      this.renewContractWechat(total_fee,pay_type,type)
    }
  },
  //店铺续费

  go: function () {
    let content = wx.getStorageSync('content');
    if(content){
      this.getJson();

    }else{
      wx.navigateTo({
        url: '../Accredit/Accredit',
      })
    }
  },
  navCour(e) {
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../Webview/Webview?h5=' + type,
    })
  },
  //店铺续费 微信
  renewContractWechat(total_fee, pay_type,type){
    this.header(app.globalData.url +'renewContract');
    wx.request({
      url: app.globalData.url + 'renewContract',
      method:"post",
      header:this.data.header,
      data:{
        total_fee: total_fee,
        pay_type: pay_type,
        type:type
      },
      success:res=>{
        let payment = res.data.data.callback;
        //调起微信支付
        wx.requestPayment({
          timeStamp: payment.timeStamp,
          nonceStr: payment.nonceStr,
          package: payment.package,
          signType: payment.signType,
          paySign: payment.paySign,
          success(res) {
            if (res.errMsg == "requestPayment:ok") {
              wx.switchTab({
                url: '../Setted/Setted',
              })
            }else{
              this.shows(res.data.msg)
            }
            }
        })
      }
    })
  },
  //店铺续费 余额
  renewContractFree(total_fee, pay_type,type){
    this.header(app.globalData.url + 'renewContract');
    wx.request({
      url: app.globalData.url + 'renewContract',
      method: "post",
      header: this.data.header,
      data: {
        total_fee: total_fee,
        pay_type: pay_type,
        type:type
      },
      success: res => {
        if(res.data.data.code ==200){
          this.hideModal();
          wx.showTabBar();
          this.setData({
            ['res.expire_time.expire_status']:0
          })
        }else{
          this.shows(res.data.msg);
          this.hideModal();
          wx.showTabBar();
        }
       
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    new app.ToastPannels();
    let store =getApp().store;
    this.setData({
      store:store
    })
    var member_mall = wx.getStorageSync("member_mall");
    let member_malls = getApp().member_mall;
    let money = wx.getStorageSync('money');
    this.setData({
      member_mall: member_mall,
      money:money
    })
    if (member_mall || member_malls) {
      this.getShopInfo();
    } else {
      this.setData({
        member_mall: false
      })
    }
  },


  //获取店铺信息
  getShopInfo() {
    var that = this;
    that.header(app.globalData.url + 'sellerCenter');
    wx.request({
      url: app.globalData.url + 'sellerCenter',
      header: that.data.header,
      success: res => {
        if (res.data.code == 200) {
          if (res.data.data.seller_center) {
            this.setData({
              member_mall: true
            })
          } else {
            member_mall: false
          }
          wx.setStorage({
            key: 'shopInfo',
            data: res.data.data.seller_center.seller_info
          })
          this.setData({
            res: res.data.data.seller_center,
            imgUrls: res.data.data.seller_center.banner
          })
        } else {
          that.show(res.data.msg)
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getShopInfo();
    var member_mall = wx.getStorageSync("member_mall");
    this.setData({
      member_mall: member_mall
    })
    if (this.data.member_mall) {
      this.getShopInfo();
    } else {
      this.setData({
        member_mall: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  }
})