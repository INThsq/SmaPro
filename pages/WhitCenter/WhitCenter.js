// pages/WhitCenter/WhitCenter.js
var w = "";
var h = "";
var app = getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionSheetHidden:true
  },
  Title(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      Toast: id
    })
    this.setData({
      isShows: true,
    })
  },
  Sure() {
    this.setData({
      isShows: false
    })
  },
  back(){
    let dot = getApp().dot;
    if(dot == 1){
      wx.switchTab({
        url:'../index/index'
      })
      app.dot=0;
    }else{
      wx.navigateBack({
        delta: 1
      })
    }
   
  },  
  Canel(){
    this.setData({
      actionSheetHidden:true
    })
  },  
  Record(){
    let id = this.data.id;
    let num = this.data.num;
    wx.navigateTo({
      url: '../Record/Record?scene_type=1&&way=0&&id='+id+'&&num='+num,
    })
  },
  //页面跳转
  
  Replen(e){
    let id = e.currentTarget.dataset.id;
    this.deliveryGoods(id)
  },
  //扫码
  ScanCode(){
      wx.scanCode({
          success:res=>{
            let path =res.path||res.result;
            var index = path.lastIndexOf("=");
            path = path.substring(index + 1, path.length);
             this.setData({
               searchValue:path
             })
             wx.navigateTo({
               url:'../Query/Query?dot_num='+path,
             })
          }
      })  
  },
  //二维码
  StoreCode(e){
    let mall_dot_authorize_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../StoreCode/StoreCode?mall_dot_authorize_id=' + mall_dot_authorize_id
    })
  },
  searchSubmitFn(){
    let searchValue = this.data.searchValue;
    wx.navigateTo({
      url: '../Query/Query?dot_num='+searchValue,
    })
  },
  //获取input内的值
  keyword(e){
    this.setData({
      searchValue:e.detail.value
    })
  },
  deliveryGoods(mall_dot_authorize_id) {
    this.header(app.globalData.url + 'deliveryGoods');
    wx.request({
      url: app.globalData.url + 'deliveryGoods',
      header: this.data.header,
      method: 'get',
      data:{
        mall_dot_authorize_id:mall_dot_authorize_id
      },
      success: res => {
        if(res.data.code == 200){
          wx.navigateTo({
            url: '../Replen/Replen?callback=' + JSON.stringify(res.data.data.callback),
          })
        }else{
          this.shows(res.data.msg)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    new app.ToastPannels();
    let that = this;
    let top = getApp().top||wx.getStorageSync('top');
    console.log(top)
   let list =JSON.parse(options.list);
   let shop = list[0];
   let img = wx.getStorageSync('img');
   let imgs = wx.getStorageSync('imgs');
    that.dotCenter(shop.mall_dot_authorize_id, shop.order_num)
   that.setData({
     id: list[0].mall_dot_authorize_id,
     num:list[0].order_num,
     list:list,
     shop:shop,
     img:img,
     imgs:imgs,
     top:top,
     text: top.system_notice.content
   })
    wx.setStorageSync('mall_dot_authorize_id', list[0].mall_dot_authorize_id)
    wx.setStorageSync('order_num', list[0].order_num)
   top.task_list.map((item,key) => {
     this.drawCanvas(item.scale * 100, item.total, `runCanvae${item.total}${key}`);
    })
  },
  //跳转提现页面
  Apply(){
    let money = this.data.callback.mall_dot.money;
    wx.navigateTo({
      url: '../WhitCash/WhitCash?money='+money+'&type=1',
    })
  },
  //绘制内容
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
        ctx2.arc(w, h, w - 8, 1.5 * Math.PI, (1.5 + src * n) * Math.PI,false); //每个间隔绘制的弧度
        ctx2.setStrokeStyle("#FF9948");
        ctx2.setLineWidth("3");
        ctx2.setLineCap("round");
        ctx2.stroke();
        ctx2.beginPath();
        ctx2.setFontSize(10); //注意不要加引号
        ctx2.setFillStyle("#FF9948");
        ctx2.setTextAlign("center");
        ctx2.fillText('总量', w, h * .9);
        ctx2.setFontSize(12); //注意不要加引号
        ctx2.setFillStyle("#FF9948");
        ctx2.setTextAlign("center");
        ctx2.fillText(scale, w, h * 1.4);
        ctx2.draw(false);
      }, 50)
    })
  },

 //绘制背景
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
 
  listenerButton: function () {
    this.setData({
      //取反
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },

  listenerActionSheet: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  //选取会员
  itemChange(e) {
    var id = e.target.dataset.id;
    var num = e.target.dataset.num;
    let name = e.target.dataset.name;
    wx.setStorageSync('mall_dot_authorize_id', id)
    wx.setStorageSync('order_num',num)
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      shop:name,
      id:id,
      num:num
    })
    this.dotCenter(id,num)
  },
  //门店中心
  dotCenter(mall_dot_authorize_id, order_num){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url +'dotCenter');
    wx.request({
      url: app.globalData.url +'dotCenter',
      header:this.data.header,
      method:'get',
      data:{
        mall_dot_authorize_id:mall_dot_authorize_id,
        order_num:order_num
      },
      success:res=>{
        this.setData({
          isShow:false
        })
        res.data.data.callback.task_list.map((item, key) => {
          this.drawCanvas(item.scale * 100, item.total, `runCanvae${item.total}${key}`);
        })
        this.setData({
          callback:res.data.data.callback
        })
      }

    })
  },
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let mall_dot_authorize_id = wx.getStorageSync('mall_dot_authorize_id');
    if(mall_dot_authorize_id){
      let order_num = wx.getStorageSync('order_num');
      this.dotCenter(mall_dot_authorize_id,order_num)
    }
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
      var session_id = wx.getStorageSync('session_id');
      var header = {
        "sign": password,
        "timestamp": timestamp,
        "noncestr": noncestr,
        "uuid": uuid,
        "token": token,
        "expirytime": expiry_time,
        "logintype": logintype,
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
  onReady: function () {
    this.data.top.task_list.map((item,key) => {
      this.shadowCanvas(`bgCanva${item.total}${key}`);
    })
   
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
})