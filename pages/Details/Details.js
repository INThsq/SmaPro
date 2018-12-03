// pages/UserCenter/userCenter.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://oss.myzy.com.cn/wechat/images/1.png',
      'http://oss.myzy.com.cn/wechat/images/1.png'
    ],
    shopInfo:{
      shop_name:'WASSUP18冬季新款四色棉服连帽立领宽松防风保暖短款外套',
        shop_img:'',
        shop_color:'',
        shop_size:'',
        shop_num:''
    },
    autoplay: true,
    interval: 5000,
    duration: 1000,
    swiperCurrent: 0,
    guige: [
      { id: 1, name: '41' },
      { id: 2, name: '42' },
      { id: 3, name: '43' },
      { id: 4, name: '44' },
      { id: 1, name: '41' },
      { id: 2, name: '42' },
      { id: 3, name: '43' },
      { id: 4, name: '44' }
    ],
    color: [
      { id: 5, name: '白色/红色' },
      { id: 6, name: '白色/淡蓝色' },
      { id: 7, name: '黄色' },
      { id: 8, name: '黑色' },
      { id: 5, name: '白色' },
      { id: 6, name: '白色/淡蓝色' },
      { id: 7, name: '白色' },
      { id: 8, name: '黑色' }
    ],
    gid: 0,
    gindex: 0,
    cid: 0,
    cindex: 0,
    num: 1,
    hides:true,
    // 使用data数据对象设置样式名
    minusStatus: 'disabled',
    //距离高度
    toView: 'one',
    scrollTop: 0,
    hide: true
  },
  lower: function (e) {
    console.log('333');
    this.setData({
      intoView: "two",
      // hides:false,
      // scrollTop:990
    })
  },
  // 滚动条滚动后触发
  scroll: function (e) {
   console.log(e.detail.scrollTop)

  },
 
  //通过设置滚动条位置实现画面滚动
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 100
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击确认支付
  buy:function(){
     let shopInfo = {
       shop_name: 'WASSUP18冬季新款四色棉服连帽立领宽松防风保暖短款外套',
        shop_img: this.data.imgUrls[0],
        shop_color: this.data.color[this.data.cindex].name,
        shop_size: this.data.guige[this.data.gindex].name,
        shop_num:this.data.num
      }
      app.shopInfo = shopInfo;
    wx.navigateTo({
      url: '../Confirm/Confirm',
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  //选择规格
  chooseSize(){
    this.showModal();
    
  },
  //点击我显示底部弹出框
  Confirm: function () {
    this.hideModal();
  },
  guige: function (e) {
    this.setData({
      gid: e.currentTarget.dataset.index,
      gindex: e.currentTarget.dataset.current,
    })
  },
  color: function (e) {
    this.setData({
      cid: e.currentTarget.dataset.index,
      cindex: e.currentTarget.dataset.current,
    })
  },
  // 关闭模态框
  cloose:function(e){
    this.hideModal();
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
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回
    this.setData({
      num: num
    });
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
  //商家中心


  income: function () {
    wx.navigateTo({
      url: '../SettedEarn/SettedEarn',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
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
    console.log('111');
    this.scrolles;
    this.setData({
      hides:true
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})