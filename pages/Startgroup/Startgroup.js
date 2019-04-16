// pages/Startgroup/Startgroup.js
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp();
import Card from '../../palette/share.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hides:true,
    hour: '00',
    minutes: '00',
    seconds: '00',
    mill: '00',
    lockImg:'http://oss.myzy.com.cn/wechat/images/icon_cuxiao_suo1.png',
    lockNum:'',
    addImg:'http://oss.myzy.com.cn/wechat/images/icon_cuxiao_jia1.png',
    addNum:'',
    timestamp:0,
    visible: false,
    imageshare:'',
    isShow:false,
    back:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onPageScroll: function (res) {
    let scrollTop = res.scrollTop;
    this.setData({
      scrollTop: scrollTop
    })
  },
  //生成二维码
  GetCode(e){
    let type = e.currentTarget.dataset.type
    let state = e.target.dataset.state
    this.setData({
      type:type
    })
    switch(state){
      case 0:
        this.openGiftSharing(this.data.mall_goods_id);
        this.setData({
          hides: false,
          back: true
        })
        break;
      case 2:
        // this.shows('级别不够无法解锁,赶紧升级吧~');
        this.shows(share_gift_tips)
        break;
      case 1:
        this.Modal.showModal();
        break;
      case 3:
        // this.shows('暂不支持分享,维护中...')  
        this.shows(share_gift_tips)
    }    
   
  },
  close(){
    this.setData({
      hides:true,
      back:false
    })
  },
  onLoad: function (options) {
    
    this.setData({
      isShow:true
    })
    setTimeout(() => {
      this.setData({
        isShow: false
      })
    },2000)
    let mall_goods_id = options.id;
    let type = options.type;
    this.giftGiving(mall_goods_id);
    this.setData({
      mall_goods_id:mall_goods_id,
      type:type
    })
    new app.ToastPannels();
    let goods = wx.getStorageSync('goods') || JSON.parse(options.goods);
    //判断类型
    let virtual_type = goods.virtual_type;
    var imgs= options.img;
    var price = options.price;
    switch (virtual_type) {
      //实物
      case 0:
        let imges = goods.images[0]||imgs;
        let price = goods.price||price;
        
        this.setData({
          template: new Card().palette({
            imges: imges,
            price: '免费',
            tip: '(包邮哦~)'
          }),
        });
        break;
      case 1:
        var imges = goods.images[0]||imgs;
        var price = goods.price||price;
        this.setData({
          template: new Card().palette({
            imges: imges,
            price: price,
            tip: '(代金券)'
          }),
        });
        break;
    }
       
    
  },
  //开团信息
  giftGiving(mall_goods_id){
    var that = this;
    var gift_queue_id = this.data.gift_queue_id;
    that.header(app.globalData.url +'giftGiving')
    wx.request({
      url: app.globalData.url +'giftGiving',
      method:'get',
      header:that.data.header,
      data:{
        mall_goods_id:mall_goods_id
      },
       success: res =>{
         if(res.data.code == 200){
           if (res.data.data.callback.share_gift.gift_queue_id){
             this.setData({
               gift_queue_id: res.data.data.callback.share_gift.gift_queue_id,
               timestamp:res.data.data.callback.share_gift.expire_time
             })
           }
           if (res.data.data.callback.gift_praise.length == 0){
             this.openGiftSharing(mall_goods_id)
           }
           console.log(Number(res.data.data.callback.give_num) - Number(res.data.data.callback.gift_praise.length))
           that.setData({
             giftGiving: res.data.data.callback,
             //可赠送人数
             addNum: Number(res.data.data.callback.give_num) - Number(res.data.data.callback.gift_praise.length),
             //上锁人数
             lockNum: Number(10) - Number(res.data.data.callback.give_num),
             //标识
             share_gift: res.data.data.callback.share_gift,
             gift_praise: res.data.data.callback.gift_praise,
           })
         } else {
           
           utils.error(res);
         }
       }
    })
  },
  onImgOK(e) {
    this.imagePath = e.detail.path;
    this.setData({
      imageshare: e.detail.path
    })
  },
  //立即开团
  openGiftSharing(mall_goods_id){
    let that = this
    let state = this.data.state
    that.header(app.globalData.url + 'openGiftSharing')
    wx.request({
      url: app.globalData.url +'openGiftSharing',
      method:'POST',
      header:that.data.header,
      data:{
        mall_goods_id:mall_goods_id,
      },
      success:res=>{
        if(res.data.code == 200){
          if(state == 3){
            this.giftGiving(res.data.data.callback.mall_goods.member_mall_id)
            this.setData({
              state:1
            })
          }
        app.share_relation = res.data.data.callback.share_relation;
         that.setData({
           share_relation: res.data.data.callback.share_relation, 
           code:res.data.data.callback.qr_code
         })
          let gift_praise = res.data.data.callback.gift_praise;
          if(gift_praise){
            that.setData({
              share:1,
              // addNum: Number(res.data.data.callback.give_num) - Number(gift_praise.length),
              gift_queue_id: res.data.data.callback.share_gift.gift_queue_id
            })
          }else{
            that.setData({
              share:1,
              // addNum: Number(res.data.data.callback.give_num) - 0,
              
            })

          }
        that.setData({
          //可赠送人数
          //上锁人数
          // lockNum: Number(10) - Number(res.data.data.callback.give_num),
          //标识
          share_gift: res.data.data.callback.share_gift,
          timestamp: res.data.data.callback.share_gift.expire_time,
          //开团队列id
          gift_queue_id: res.data.data.callback.share_gift.gift_queue_id,
          //开团队列编号
          // order_num: res.data.data.callback.share_gift.order_num
        })
          app.gift_queue_id = res.data.data.callback.share_gift.gift_queue_id
        } else {
          // utils.error(res);
          this.shows(res.data.msg);
        }
      }
    })
  },
  
  //倒计时
  count() {
    var that = this
    var timestamp = that.data.timestamp
    var totalSecond = timestamp - Date.parse(new Date()) / 1000;
    console.log(timestamp);
    that.data.interval = setInterval(function () {
      // 秒数
      var second = totalSecond;

      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      var dtime = '' + hrStr + ':' + minStr + ':' + secStr
      that.setData({
        dtime: dtime
      });
      totalSecond--;

    }.bind(this), 1000);
  },
  
  // 返回上一页
  back: function () {
    let type = this.data.type;
    if(type){
      wx.switchTab({
        url: '../index/index',
      })
    }else{
      wx.navigateBack({
        delta: 1,
      })
    }
   
  },
  
  //立即开团状态

  State(e){
    let state = e.target.dataset.state
    let type = e.currentTarget.dataset.type
    this.setData({
      type:type
    })
    let share_gift_tips = this.data.giftGiving.share_gift_tips
    switch(state){
      case 0:
          this.openGiftSharing(this.data.mall_goods_id);
      break;
      case 2:
        // this.shows('级别不够无法解锁,赶紧升级吧~');
        this.shows(share_gift_tips)
        break;
      case 1:
        this.Modal.showModal();
        break;
      case 3:
        // this.shows('暂不支持分享,维护中...')  
        this.shows(share_gift_tips)
    }
  },
  _confirmEventFirst: function () {
    let type= this.data.type
    this.setData({
      state:3
    })
    if(type == 1){
        this.openGiftSharing(this.data.mall_goods_id);
        this.Modal.hideModal();
    }else{
        this.openGiftSharing(this.data.mall_goods_id);
        this.setData({
          hides: false,
          back: true
        })
        this.Modal.hideModal();
    }
    
  },
  _cancelEvent: function () {
    this.Modal.hideModal();
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
    let that = this;
    that.count()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this
    clearInterval(that.data.interval)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this
    clearInterval(that.data.interval)
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
  Web(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../Webview/Webview?h5='+url,
    })
  },
  /**
   * 
   * 用户点击右上角分享
   */
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (ops) {
    let gift_queue_id = this.data.gift_queue_id;
    let name = this.data.giftGiving.member_oauth.nickname;
    let path = '/pages/EarnMoney/EarnMoney?gift_queue_id=' + gift_queue_id;
    let imageshare = this.data.imageshare;
    console.log(path)
    return {
      title: '你的好友['+name+']免费发福利啦,赶紧领取包邮哦~', // 转发后 所显示的title
      path:path, // 相对的路径
      imageUrl:imageshare,
      success: (res) => {    // 成功后要做的事情
                                           
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
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