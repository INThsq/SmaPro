// pages/Address/Address.js
var app = getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js'); 


Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxdata:'',
    chooseType:'',
    del_num:'',
    index:'',
    datas:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannels();
    app.adress = 1;
    var a = getApp().chooseType;
    var that = this;    
    if(a){
      that.setData({
        chooseType: a
      })
    }
     
    if (a!=='1'){
    
      var datas = getApp().datas;
      if(datas){
        that.setData({
          datas: datas,
        })
      }
      
    }
 
    this.getsAdress();
  },
  
  back(){
    let types = getApp().types;
    if(types == 2){
    
      let datas = this.data.datas;
      if(datas.length >0){
        var shuju = ''
        for (let d = 0; d < datas.length; d++) {
          if (datas[d].is_default == 1) {
            shuju = datas[d]
          }
        }
        var flag = true;
        wx.navigateTo({
          url: '../Confirm/Confirm?id=' + shuju.member_address_id + "&address=" + shuju.region_path_name + shuju.address + "&mobile=" + shuju.mobile + "&realname=" + shuju.realname + "&flag=" + flag,
        })
      }else{
        wx.navigateTo({
          url: '../Confirm/Confirm?addrss=null',
        })
      }
      
     
    }else{
      wx.navigateBack({
        delta: 1,
      })
    }
  
  },
  //获取地址
  //md5
  getsAdress() {
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url+'addressList');
    wx.request({
      url:app.globalData.url+'addressList',
      method: 'GET',
      header:this.data.header,
      success: res => {
        this.setData({
          isShow:false
        })
        if (res.data.data.address_list.length > 0){
          this.setData({
            datas: res.data.data.address_list
          })
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
    var session_id = wx.getStorageSync('session_id');
    var header = {
      "sign": password,
      "timestamp": timestamp,
      "noncestr": noncestr,
      "uuid": uuid,
      "token": token,
      "expirytime": expiry_time,
      "logintype":logintype,
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
  //选择地址
  chooseAdress(e){
    if(this.data.chooseType == 1){
    // 如果下单页面就点击返回
      let member_address_id = e.currentTarget.dataset.member;
      let index = e.currentTarget.dataset.index;
      let datas = this.data.datas;
      let choose =  datas[index];
      // app.chooseAddress = datas[index];
      // wx.setStorageSync('chooseAddress',datas[index])
      var flag = true;
        wx.navigateTo({
          url: '../Confirm/Confirm?id='+choose.member_address_id+"&address="+choose.region_path_name+choose.address+"&mobile="+choose.mobile+"&realname="+choose.realname+"&flag="+flag,
        })
    } else if (this.data.chooseType == 3){
      let member_address_id = e.currentTarget.dataset.member;
      let index = e.currentTarget.dataset.index;
      let datas = this.data.datas;
      let choose = datas[index];
      // app.chooseAddress = datas[index];
      // wx.setStorageSync('chooseAddress',datas[index])
      var flag = true;
      wx.navigateTo({
        url: '../Converted/Converted?id=' + choose.member_address_id + "&address=" + choose.region_path_name + choose.address + "&mobile=" + choose.mobile + "&realname=" + choose.realname + "&flag=" + flag,
      })
    }
      
        

  },
  //设置默认地址
  selectList(e) {
    let member_address_id = e.currentTarget.dataset.member;
    let index = e.currentTarget.dataset.index;
    let datas = this.data.datas;
    this.header(app.globalData.url+'setAddressDefault');
    wx.request({
      url:app.globalData.url+'setAddressDefault',
      method: 'post',
      header:this.data.header,
      data:{
        member_address_id: member_address_id
      },
      success: res => {
        if(res.data.code == 200){
          for (var i in datas) {
            datas[i].is_default = 0;
          }
          datas[index].is_default = 1;
          this.setData({
            datas:datas
          })
          this.shows(res.data.msg)
          

        }else{
          utils.error(res);
        }

      }
      })
  //   if (index == 0) {
  //     this.setData({
  //       'datas.sa_addr_true': 1
  //     })
  //   } else {
  //     this.setData({
  //       'datas.sa_addr_true': 0
  //     })
  //   }

  },
  //删除地址
  del(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      del_num: e.currentTarget.dataset.member,
      index:index
    })
    this.Modal.showModal();
    this.getsAdress();
    },
  // 确定删除
  _confirmEventFirst() {
    this.header(app.globalData.url+'deleteAddress');
    var datas = this.data.datas
    wx.request({
      url:app.globalData.url+'deleteAddress',
      method: 'post',
      header:this.data.header,
      data:{
        member_address_id: this.data.del_num
      },
      success:res=>{
        if(res.data.code == 200){
          this.shows(res.data.msg)

          datas.splice(this.data.index, 1);
          this.setData({
            datas:datas
          })
        }else{
          utils.error(res);
        }
        
      }
      })
    this.getsAdress();
    this.Modal.hideModal();
  },
  // 取消删除
  _cancelEvent: function () {
    wx.showToast({
      title: '删除失败',
      icon: 'none',
      duration: 10000
    })

    setTimeout(function () {
      wx.hideToast()
    }, 2000)
  },
  //新建收货地址
  addAdress: function () {
    getApp().changeAddressStart(1);
    wx.navigateTo({
      url: '../Address_es/Address_es',
    })
  },
  //编辑收货地址

  edit: function (e) {
    var index = e.currentTarget.dataset.index;
    app.datas = this.data.datas[index];
    getApp().changeAddressStart(2);
    wx.navigateTo({
      url: '../Address_es/Address_es',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.Modal = this.selectComponent("#modal");
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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