// pages/Confirm/Confirm.js
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    minusStatus: 'disabled',
    num:'1',
    addressDetails:{
      sa_addr_true:1
    },
    totalPrice:0,
    price:'599',
    menuTapCurrent:'0',
    nedPay:'0'
  },
  //选择类型
  menuTap: function (e) {
    var current = e.currentTarget.dataset.current;//获取到绑定的数据
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrent: current
    });


  },
  //选择地址
  addAdress(e){
    wx.navigateTo({
      url: '../Address/Address',
    })
    app.chooseType = 1;
  },
  /* 点击减号 */

  bindMinus: function () {
  
    var num = this.data.num;
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
    this.totalPrice();
  },
  //点击到商品详情
  details(){
    wx.navigateTo({
      url: '../Details/Details',
    })
  },
  //总额
  totalPrice(){
      let total = 0;
      total = Number(this.data.price) * (this.data.num);
      this.setData({
        totalPrice:total.toFixed(2)
      })
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
    this.totalPrice();
    
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回
    this.setData({
      num: num
      
    });
    this.totalPrice();
    
  },
  //点击弹出支付方式
  submits:function(e){
    this.showModal();
  }, 
  //swtich状态更改
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
  close:function(){
    this.hideModal();
  },
  //支付
  topay:function(){
    wx.navigateTo({
      url: '../Payment/Payment',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //商品
    let shopInfo = getApp().shopInfo;
    this.setData({
      shopInfo: shopInfo,
      num:shopInfo.shop_num
    }),
      this.totalPrice();
      //获取本地存储
    // wx.getStorage({
    //   key: 'chooseAdress',
    //   success: function(res) {
    //     console.log(res);
    //   },
    // })
    var datas = getApp().datas;
    this.setData({
      datas: datas,
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