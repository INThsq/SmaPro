// pages/FyCenter/FyCenter.js
var util = require('../../utils/md5.js')
var utils = require('../../utils/util.js')
var app = getApp();
var w = "";
var h = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    isShow: true,
    isShows: false,
  },
  //跳转查询页面
  Query(){
    // scene_type 1 经销商
    app.scene_type = 1;
    wx.navigateTo({
      url: '../Query/Query',
    })
  },
  //点击调试
  Sure(){
    this.setData({
      isShows:false
    })
  },
  Title(e){
    console.log(e);
    let id = e.currentTarget.dataset.id;
    this.setData({
      Toast:id,
      isShows: true,

    })
  },

  //跳转核销记录
  Record(){
    wx.navigateTo({
      url: '../Record/Record?scene_type=0',
    })
  },
  //赠送记录
  Notgifts(){
    wx.navigateTo({
      url: '../Notgifts/Notgifts?gift=1',
    })
  },
  //申请结算
  SetOrder(){
    let mall_giveaway_authorize_id = this.data.top.mall_giveaway.mall_giveaway_authorize_id;
    wx.navigateTo({
      url: '../SetOrder/SetOrder?id='+mall_giveaway_authorize_id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isShow:true
    })
    new app.ToastPannels();
    if(options.top){
      var top = JSON.parse(options.top)
      this.setData({
        top:top,
        giveaway_num:top.mall_giveaway.mall_giveaway_authorize_id,
        giveaway_num:top.mall_giveaway.giveaway_num,
        isShow:false
      })
       top.task_list.map((item,key) => {
         console.log(key)
        this.drawCanvas(item.scale * 100,item.total, `runCanvas${item.scale}${key}`);
      })

    }
    if (options.goods_id){
      this.setData({
        goods_id: options.goods_id,
        mall_goods_id: options.mall_goods_id,
        order_num: options.order_num
      })
    }
    let content = wx.getStorageSync('content');
    let scenes = app.scenes;
    this.setData({
      scenes:scenes
    })
    if(content){
      let mall_giveaway_authorize_id =top.mall_giveaway.mall_giveaway_authorize_id;
      let giveaway_num =top.mall_giveaway.giveaway_num;
      this.dataStatistics(1,giveaway_num,mall_giveaway_authorize_id);
    }else{
      wx.navigateTo({
        url: '../Accredit/Accredit',
      })
    }

  },
  back(){
    let scenes = getApp().scenes;
    if(scenes == 0){
      wx.navigateBack({
        delta:1
      })
    }else{
      wx.switchTab({
      url: '../UserCenter/userCenter',
      })
    }
    
  },
  // 分销中心
  distribution(member_mall_id){
    var scenes = this.data.scenes;
    var data ={};
    switch(scenes){
      // 非订单验证
        case 0:
        data={
          scene:0,
          order_num:'',
          goods_id:0,
          member_mall_id:0
        }
        break;
        // 订单验证
        case 1:
        let goods_id = this.data.goods_id;
        let mall_goods_id = this.data.mall_goods_id;
        let order_num = this.data.order_num;
        data={
          goods_id:goods_id,
          mall_goods_id:mall_goods_id,
          order_num:order_num
        }
        break;
    }
    this.header(app.globalData.url +'distribution');
    wx.request({
     
      url: app.globalData.url +'distribution',
      header:this.data.header,
      method:'get',
      data:data,
      success:res=>{
        
        if(res.data.code ==200){
          this.setData({
            top:res.data.data.callback,
            giveaway_num: res.data.data.callback.mall_giveaway.mall_giveaway_authorize_id,
            giveaway_num: res.data.data.callback.mall_giveaway.giveaway_num
          })
        }
      }
    })
  },
  //分销中心数据统计
  dataStatistics(day, mall_giveaway_authorize_id, giveaway_num){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url +'dataStatistics');
    
    wx.request({
      url: app.globalData.url +'dataStatistics',
      header:this.data.header,
      data:{
        day:day,
        giveaway_num:giveaway_num,
        mall_giveaway_authorize_id:mall_giveaway_authorize_id
      },
      method:'get',
      success:res=>{
        this.setData({
          isShow:false
        })
          if(res.data.code == 200){
            this.setData({
              total_list:res.data.data.callback.total_list,

            })
          }
      }
    })
  },
 
  //点击切换
  clickTab(e){
    let id = e.currentTarget.dataset.id;
    let mall_giveaway_authorize_id = this.data.top.mall_giveaway.mall_giveaway_authorize_id;
    let giveaway_num = this.data.top.mall_giveaway.giveaway_num;
    let current = e.currentTarget.dataset.current;
    this.setData({
      currentTab:current
    })
    this.dataStatistics(id,mall_giveaway_authorize_id,giveaway_num)
  },
  //圆弧绘制
  drawCanvas(e, scale, id) {
    let that = this;
    let canvasid = id
    let allSrc = 0.015 * e; //应该绘制的弧度
    let src = allSrc / 100
    let n = 0;
    that.setData({
      src: src,
      allSrc: allSrc
    }, () => {
      let mytime = setInterval(function () {
        let ctx2 = wx.createCanvasContext(canvasid);
        n++;
        if (src * n > allSrc) {
          clearInterval(mytime); //如果绘制完成，停掉计时器，绘制结束
          n = 0;
          return;
        }
        let grade = Math.round(src * n / 1.5 * 100);
        //百分数
        ctx2.arc(w, h, w - 8, 0.75 * Math.PI, (0.75 + src * n) * Math.PI); //每个间隔绘制的弧度
        ctx2.setStrokeStyle("#F43736");
        ctx2.setLineWidth("3");
        ctx2.setLineCap("round");
        ctx2.stroke();
        ctx2.beginPath();
        ctx2.setFontSize(10); //注意不要加引号
        ctx2.setFillStyle("#F43736");
        ctx2.setTextAlign("center");
        ctx2.fillText('总量', w, h * .9);
        ctx2.setFontSize(12); //注意不要加引号
        ctx2.setFillStyle("#F43736");
        ctx2.setTextAlign("center");
        ctx2.fillText(scale, w, h * 1.4);
        ctx2.draw();
      }, 50)
    })
  },
 //圆圈绘制
  shadowCanvas(id) {
    const ctx = wx.createCanvasContext(id);
    w = parseInt(65 / 2); //获取canvas宽的的一半
    h = parseInt(65 / 2); //获取canvas高的一半，
    ctx.arc(w, h, w - 8, 0.75 * Math.PI, 10 * Math.PI); //绘制圆形弧线
    ctx.setStrokeStyle("#f3f3f3"); //设置填充线条颜色
    ctx.setLineWidth("3");     //设置线条宽度
    ctx.setLineCap("round");        //设置线条端点样式
    ctx.stroke();     //对路径进行描边，也就是绘制线条。
    ctx.draw();       //开始绘制
  },
  //跳转可提现页面
  myOrder(){
    let money = this.data.top.money;
    wx.navigateTo({
      url: '../WhitCash/WhitCash?money='+money,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.data.top.task_list.map((item,key) => {
      this.shadowCanvas(`bgCanvas${item.scale}${key}`);
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