// pages/Address_es/Address_es.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面类型
    pageType: 1,
    //表单信息  为下单页面测试
    addressDetails: {
      sa_area: '',
      sa_name: '',
      sa_tel: '',
      sa_addr_true: 1,
      sa_area_xx: '',
    },
    currentTab1:0,
    currentTab2:0,
    currentTab3:0,
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
    defaultsheng: [
      {
        "item_code": "110000",
        "item_name": "四川省",
      },
      {
        "item_code": "110000",
        "item_name": "北京省",
      }
    ],
    chooseType: 1,
    defaultCity: [],
    defaultQu: [],
    cityJson: [
      { "item_code": "230000", "item_name": "黑龙江省" },
      { "item_code": "310000", "item_name": "上海市" },
      { "item_code": "320000", "item_name": "江苏省" },
      { "item_code": "330000", "item_name": "浙江省" },
      { "item_code": "340000", "item_name": "安徽省" },
      { "item_code": "350000", "item_name": "福建省" },
      { "item_code": "360000", "item_name": "江西省" }
    ],
    hiddens: false,
    hiddent: true,
    hiddenth: true

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
      "addressDetails.sa_area_xx": value,
    });
  },
  //选择地区
  handleTap: function (e) {
    var text = e.target.dataset.text;
    var index = e.target.dataset.index;
    var type = e.target.dataset.type;
    var that = this;
    var data = {};
    if (type == 1) {
      that.setData({
        defaultCity: [],
        "choose.sheng": false,
        hiddent: false,
        hiddenth: true,
        hiddens: true,

      })
      data = {
        defaultCity: that.data.cityJson,
        "choose.sheng": text,
        chooses: text,
        currentTab1:index
      }
    }
    if (type == 2) {
      that.setData({
        defaultQu: [],
        "choose.shi": false,
        
        hiddens: true,
        hiddent: true,
        hiddenth: false

      })
      data = {
        defaultQu: [
          { "item_code": "110000", "item_name": "昌平区" },
          { "item_code": "120000", "item_name": "丰台区" },
        ],
        "choose.shi": text,
        chooses: text,
        chooseType: 2,
        currentTab2: index
      }
    }
    if (type == 3) {
      data = {
        "choose.qu": text,
        chooses: text,
        chooseType: 3,
        hiddens: true,
        hiddent: true,
        hiddenth: false,
        currentTab3: index

      }
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
    if (e.detail.value) {
      this.setData({
        'addressDetails.sa_addr_true': 0
      })
    } else {
      this.setData({
        'addressDetails.sa_addr_true': 1
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
  //提交信息
  save: function (e) {
    console.log(e);
    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    var isMobile = mobile.exec(this.data.addressDetails.sa_tel);
    if (!isMobile) {
      wx.showToast({
        title: '手机号格式有误！',
        icon: 'none',
        duration: 10000
      })

    } else {
      console.log('1111');
      let datas = {
        choose: this.data.choose,
        sa_name: this.data.addressDetails.sa_name,
        sa_tel: this.data.addressDetails.sa_tel,
        sa_addr_true: this.data.addressDetails.sa_addr_true,
        sa_area_xx: this.data.addressDetails.sa_area_xx
      }
      app.datas = datas;
      var a = getApp().datas;
      wx.navigateTo({
        url: '../Address/Address',
      })
    }
    // var datas = getApp().datas;
    // console.log(datas);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var datas = getApp().datas;
    
    this.setData({
      pageType: app.globalData.addressStart,
      addressDetails: datas,
      choose: datas.choose
      
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