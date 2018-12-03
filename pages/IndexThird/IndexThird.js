const app = getApp()

// pages/UserCenter/userCenter.js
Page({

  /**
   * 页面的初始数据
   */

  //商家中心
  data: {
    userInfo: {},
    // 标题文字
    texte:'',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
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
        text: '电器3',
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
    navScrollLeft: 0,
    hiddenName: true,
    currentId: 0,
    hides: false,
    hidden: true,
    load: '加载中...',
    tjhide: true

  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  swiperChanges: function (e) {
    this.setData({
      swiperCurrents: e.detail.current
    })
  },
 
  //  显示
  show: function () {
    this.setData({
      hiddenName: false
    })
  },
  // 隐藏
  hide: function () {
    this.setData({
      hiddenName: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      texte: options.texte
    })
    //获取元素宽高
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          // pixelRatio: res.pixelRatio,
          // windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })

  },
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 7;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 3) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
    //首页第一个默认显示
    if (this.data.currentTab == 0) {
      this.setData({
        hides: false,
        tjhide: true
      })
      
    }
    else {
      this.setData({
        hides: true,
        tjhide: false
      })
    }

  },
  //点击每个导航的点击事件
  handleTap: function (event) {
    let id = event.currentTarget.id;
    var singleNavWidth = this.data.windowWidth / 7;
    if (id) {
      this.setData({
        currentId: id,
        hiddenName: true,
        currentTab: id,
        navScrollLeft: (id - 3) * singleNavWidth
      })
    }
    if (id == 0) {
      this.setData({
        hides: false,
        tjhide: true
      })
    } else {
      this.setData({
        hides: true,
        tjhide: false
      })
    }

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
    var that = this;




  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})