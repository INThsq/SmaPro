// pages/Address/Address.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // datas:{
    //   sa_name: '贺淑青',
    //   sa_tel: '17600784408',
    //   sa_addr_true:0,
    //   sa_area_xx: '回龙观龙博苑101',
    //   choose: {
    //     sheng: '北京市',
    //     shi: '北京市',
    //     qu: '北京市'
    //   },
    // },
    chooseType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var a = getApp().chooseType;
    console.log(a); 
    var that = this;    
    
    that.setData({
      chooseType: a

    }) 
    if (a!=='1'){
      console.log('4444');
      var datas = getApp().datas;

      that.setData({
        datas: datas,
      })
    }
   
  },
  addAdress: function () {

    wx.navigateTo({
      url: '../Address_es/Address_es',
    })
  },
  //选择地址
  chooseAdress(e){
    // 如果下单页面就点击返回
    console.log(this.data.chooseType)
    if (this.data.chooseType == 1){
      console.log('222');
      // console.log(this.data.datas)
      //   wx.setStorage({
      //     key: 'chooseAdress',
      //     data:this.data.datas,
      //   }),
      //     setTimeout(() => {
      //     wx.navigateBack();
      //     },50)

      var datas = getApp().datas;
console.log(datas);
      this.setData({
        datas: datas,
        choose: datas.choose
      }),
        setTimeout(() => {
        wx.redirectTo({
          url: '../Confirm/Confirm',
        })
        }, 50)

    }else{
      
        

    }
  },
  //设置默认地址
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    console.log(index);
    if (index == 0) {
      this.setData({
        'datas.sa_addr_true': 1
      })
    } else {
      this.setData({
        'datas.sa_addr_true': 0
      })
    }

  },

  //删除地址
  del(e) {
    this.Modal.showModal();

  },
  // 确定删除
  _confirmEventFirst: function () {

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
  addAdr: function () {
    getApp().changeAddressStart(1);
    wx.navigateTo({
      url: '../Address_es/Address_es',
    })
  },
  //编辑收货地址

  edit: function () {
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