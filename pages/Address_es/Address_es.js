// pages/Address_es/Address_es.js
var app = getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面类型
    pageType: 1,
    noncestr: '',
    //表单信息  为下单页面测试
    
    addressDetails: {
      realname: '',
      mobile: '',
      is_default: 0,
      address: '',
    },
    onFocus: false,    //textarea焦点是否选中
    isShowText: false, //控制显示 textarea 还是 text
    remark: '',
    // 选择地区
    // 选择地区
    choose: {
      sheng: '',
      shi: '',
      qu: ''
    },
    chooses: '',
    defaultsheng: '',
    chooseType: 1,
    defaultCity: [],
    defaultQu: [],
    cityJson: '',
    hiddens: false,
    hiddent: true,
    hiddenth: true,
    id: '',
    datas: ''

  },
  choosearea: function () {
    this.showModal();
    this.setData({
      isShowText: true,
      onFacus: false
    })
  },
  close: function () {
    this.hideModal();
    this.setData({
      isShowText: false,
      onFacus: true
    })
  },
  onShowTextare() {       //显示textare
    this.setData({
      isShowText: false,
      onFacus: true
    })
  },
  onShowText() {       //显示text
    // this.setData({
    //   isShowText: true,
    //   onFacus: false
    // })
  },
  onRemarkInput(event) {               //保存输入框填写内容
    var value = event.detail.value;
    this.setData({
      "addressDetails.address": value,
    });
  },
  //选择地区
  handleTap: function (e) {

    var text = e.target.dataset.text;
    var index = e.target.dataset.index;
    var type = e.target.dataset.type;
    var id = e.target.dataset.ids;
    var that = this;
    var data = {};
    this.setData({
      id: id,
    })

    if (type == 1) {

      if (text != that.data.choose.sheng) {
        that.setData({
          "choose.shi": false,
          "choose.qu": false,
          "sheng_id": type,
        })
      }
      that.setData({
        defaultCity: [],
        "choose.sheng": false,
        hiddent: false,
        hiddenth: true,
        hiddens: true,
        chooseType: 2,
      })
      this.getTwoArea();
      data = {
        defaultCity: that.data.cityJson,
        "choose.sheng": text,
        chooses: text
      }

    }
    if (type == 2) {
      if (text != that.data.choose.shi) {
        that.setData({
          "choose.qu": false,
        })
      }
      that.setData({

        defaultQu: [],
        "choose.shi": false,
        hiddens: true,
        hiddent: true,
        hiddenth: false
      })
      data = {

        "choose.shi": text,
        chooses: text,
        chooseType: 3
      }
      this.getThreeArea();


    }
    if (type == 3) {
      data = {
        "choose.qu": text,
        chooses: text,
        hiddens: true,
        hiddent: true,
        hiddenth: false

      }
      this.hideModal();
     
    }

    that.setData(data)
    console.log(that.data.defaultCity)
  },

  //重新选择
  changetab: function (e) {
    var type = e.target.dataset.index;
    var that = this;
    that.setData({
      chooseType: type
    })
    if (type == 1) {
      that.setData({
        hiddent: true,
        hiddenth: true,
        hiddens: false
      })

    }
    if (type == 2) {
      that.setData({
        hiddent: false,
        hiddenth: true,
        hiddens: true
      })

    }
    if (type == 3) {
      that.setData({
        hiddent: true,
        hiddenth: false,
        hiddens: true
      })

    }

  },
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 50,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(400).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 50)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "linear",
      delay: 0
    })
    this.setData({
      isShowText: false,
      onFacus: true
    })
    this.animation = animation
    animation.translateY(200).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 100)
  },

  //设置默认地址
  checkboxChange(e) {
    console.log(e.detail.value)
    if (!e.detail.value) {
      this.setData({
        'addressDetails.is_default': 0
      })
    } else {
      this.setData({
        'addressDetails.is_default': 1
      })
    }


  },
  // 获取填写信息
  inputDataChenge: function (e) {
    let value = e.detail.value;
    let item = 'addressDetails.' + e.target.dataset.item;
    this.setData({
      [item]: value
    })

  },
  //获取地区地址
  getArea() {
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url+'getRegion');
    wx.request({
      url: app.globalData.url+'getRegion',
      method: 'GET',
      header: this.data.header,
      success: res => {
        this.setData({
          isShow:false
        })
        this.setData({
          defaultsheng: res.data.data.region.area_list
        })
      }
    })
  },
  //获取二级地址
  getTwoArea() {
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url+'getRegion');
    wx.request({
      url:app.globalData.url+'getRegion',
      method: 'get',
      header: this.data.header,
      data: {
        parent_id: this.data.id
      },
      success: res => {
        this.setData({
          isShow:false
        })
        this.setData({
          defaultCity: res.data.data.region.area_list
        })
      }
    })
  },
  //获取三级地址
  getThreeArea() {
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url+'getRegion');
    wx.request({
      url: app.globalData.url+'getRegion',
      method: 'get',
      header: this.data.header,
      data: {
        parent_id: this.data.id
      },
      success: res => {
        this.setData({
          isShow:false
        })
        this.setData({
          defaultQu: res.data.data.region.area_list
        })
      }
    })
  },

  ///////////////////////////

  //获取二级地址
  getTwoAreaEdit(pids) {
    this.setData({
      isShow:true
    })
    // debugger;
    this.header(app.globalData.url+'getRegion');
    wx.request({
      url:app.globalData.url+'getRegion',
      method: 'get',
      header: this.data.header,
      data: {
        parent_id: pids
      },
      success: res => {
        this.setData({
          isShow:false
        })
        // debugger;
        this.setData({
          defaultCity: res.data.data.region.area_list
        })
      }
    })
  },
  //获取三级地址
  getThreeAreaEdit(pids) {
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url+'getRegion');
    wx.request({
      url:app.globalData.url+'getRegion',
      method: 'get',
      header: this.data.header,
      data: {
        parent_id: pids
      },
      success: res => {
        this.setData({
          isShow:false
        })
        this.setData({
          defaultQu: res.data.data.region.area_list
        })
      }
    })
  },

  ///////////////////////////
  //提交信息
  save: function (e) {
    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    var isMobile = mobile.exec(this.data.addressDetails.mobile);
    if (!isMobile) {
     
      this.shows('手机号格式有误！')

    } else {
      let region_path_name = this.data.choose.sheng.short_name + ',' + this.data.choose.shi.short_name + ',' + this.data.choose.qu.short_name;
      let region_path_id = this.data.choose.sheng.id + ',' + this.data.choose.shi.id + ',' + this.data.choose.qu.id
      let datas = {
        // choose: this.data.choose,
        realname: this.data.addressDetails.realname,
        mobile: this.data.addressDetails.mobile,
        is_default: this.data.addressDetails.is_default,
        address: this.data.addressDetails.address,
        region_path_id: region_path_id,
        region_path_name: region_path_name
      }
      this.header(app.globalData.url+'createAddress');
      this.setData({
        isShow:true
      })
      wx.request({
        url: app.globalData.url+'createAddress',
        method: 'POST',
        header: this.data.header,
        data: datas,
        success: res => {
          this.setData({
            isShow:false
          })
          if (res.data.code == 200) {
            this.shows(res.data.msg)
            wx.navigateTo({
              url: '../Address/Address',
            })
          }else{
            utils.error(res);
          }
        }
      })


      // app.datas = datas;
      // var a = getApp().datas;
      // wx.navigateTo({
      //   url: '../Address/Address',
      // })
    }
    // var datas = getApp().datas;
    // console.log(datas);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.ToastPannels();
    //获取一级地区
    this.getArea();
    var datas = getApp().datas;
    if(datas){
      var region_path_name_str = datas.region_path_name;
      var region_path_name_arr = new Array();
      region_path_name_arr = region_path_name_str.split(',');

      var region_path_id_str = datas.region_path_id;
      var region_path_id_arr = new Array();
      region_path_id_arr = region_path_id_str.split(',');

      this.setData({
        pageType: app.globalData.addressStart,
        // choose: datas.choose
        addressDetails: datas,
        choose: {
          sheng: {
            short_name: region_path_name_arr[0],
            id: region_path_id_arr[0]
          },
          shi: {
            short_name: region_path_name_arr[1],
            id: region_path_id_arr[1]
          },
          qu: {
            short_name: region_path_name_arr[2],
            id: region_path_id_arr[2]
          },
        }
      }); 
      this.getTwoAreaEdit(region_path_id_arr[0]);

      this.getThreeAreaEdit(region_path_id_arr[1]);
    }
  
    if(this.data.pageType == 1){
      this.setData({
        datas:''
      })
    }
   


  },
  //编辑信息
  sure: function (e) {
    let member_address_id = this.data.addressDetails.member_address_id;
    // debugger;
    if (this.data.chooses.id == undefined) {
      console.log('222');
      var region_path_id = this.data.addressDetails.region_path_id;
      var region_path_name = this.data.addressDetails.region_path_name
    } else {
      var region_path_name = this.data.choose.sheng.short_name + ',' + this.data.choose.shi.short_name + ',' + this.data.choose.qu.short_name;
      var region_path_id = this.data.choose.sheng.id + ',' + this.data.choose.shi.id + ',' + this.data.choose.qu.id
    }
    let datas = {
      id: member_address_id,
      realname: this.data.addressDetails.realname,
      mobile: this.data.addressDetails.mobile,
      is_default: this.data.addressDetails.is_default,
      address: this.data.addressDetails.address,
      region_path_id: region_path_id,
      region_path_name: region_path_name
    }
    this.header(app.globalData.url+'updateAddress');
    wx.request({
      url: app.globalData.url+'updateAddress',
      method: 'POST',
      header: this.data.header,
      data: datas,
      success: res => {
        if (res.data.code == 200) {
          this.shows(res.data.msg)
          
          wx.navigateTo({
            url: '../Address/Address',
          })

        }else{
          utils.error(res);
        }
      }
    })


    // app.datas = datas;
    // var a = getApp().datas;
    // wx.navigateTo({
    //   url: '../Address/Address',
    // })
    // var datas = getApp().datas;
    // console.log(datas);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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