// pages/OpenShop/OpenShop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    province: '',
    show: false,
    avatarUrl: 'http://oss.myzy.com.cn/wechat/images/icon_kd_zhanweitu.png',
    menuTapCurrent:0,
    navData: [
      {
        text: '推荐',
        typeId: '0'
      },
      {
        text: '配饰',
        typeId: '1'
      },
      {
        text: '电格',
        typeId: '2'

      },
      {
        text: '电器',
        typeId: '3'
      },
      {
        text: '对对对',
        typeId: '4'
      },
      {
        text: '水果',
        typeId: '5'
      },
      {
        text: '啦啦',
        typeId: '6'
      },
      {
        text: '哈哈',
        typeId: '7'
      },

    ],
    currentTab: 0,
    // 经营类目
    currrntText:'请选择',
  },
  sureSelectAreaListener: function (e) {
    var that = this;
    that.setData({
      show: false,
      province: e.detail.currentTarget.dataset.province,
    })
  },
  chooseAddress: function () {
    var that = this;
    that.setData({
      show: true
    })
  },
  //选项卡效果

  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    var text = event.currentTarget.dataset.text;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
        currrntText:text
        
      })
    }
   

  },
  //在线付款后到商家中心
  setted(){
    wx.navigateTo({
      url: '../Setted/Setted',
    })
  },
  //关闭慕态框
  close:function(){
    this.hideModal();
  },
  //选择类型
  menuTap: function (e) {
    var current = e.currentTarget.dataset.current;//获取到绑定的数据
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrent: current
    });


  },
  change:function(){
    this.showModal();
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
  /**
   * 生命周期函数--监听页面加载
   */

  
  onshowActionSheet: function () {
    console.log('000');
    var that = this;
    wx.showActionSheet({
      itemList: ['拍照', '打开相册'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              var tempFilePaths = res.tempFilePaths
              that.setData({
                avatarUrl: tempFilePaths
              })  
            }
          })
        } else{
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
              that.setData({
                avatarUrl:tempFilePaths
              })
            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)

      }
    })
  },
  //跳转
  setted(){
    wx.switchTab({
      url: '../Setted/Setted',
    })
  },
  onLoad: function (options) {
      
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