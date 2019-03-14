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
    isShow:true
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
  onLoad: function (options) {
    let mall_goods_id = options.id;
    let type = options.type;
    this.giftGiving(mall_goods_id);
    this.setData({
      mall_goods_id:mall_goods_id,
      type:type
    })
    new app.ToastPannel();
    let goods = wx.getStorageSync('goods') || JSON.parse(options.goods);
    //判断类型
    let virtual_type = goods.virtual_type;
    switch (virtual_type) {
      //实物
      case 0:
        let imges = goods.images[0];
        let price = goods.price;
        this.setData({
          template: new Card().palette({
            imges: imges,
            price: '免费',
            tip: '(包邮哦~)'
          }),
        });
        break;
      case 1:
        var imges = goods.images[0];
        var price = goods.price;
        this.setData({
          template: new Card().palette({
            imges: imges,
            price: price,
            tip: '(代金券)'
          }),
        });
        break;
    }
        setTimeout(()=>{
          this.setData({
            isShow: false
          })
        },1500)
    
  },
  //开团信息
  giftGiving(mall_goods_id){
    var that = this;
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
           that.setData({
             giftGiving: res.data.data.callback,
             //可赠送人数
             addNum: Number(res.data.data.callback.give_num) - Number(res.data.data.callback.gift_praise.length),
             //上锁人数
             lockNum: Number(10) - Number(res.data.data.callback.give_num),
             //标识
             share_gift: res.data.data.callback.share_gift,
             gift_praise: res.data.data.callback.gift_praise,
             timestamp: res.data.data.callback.share_gift.expire_time,
             //开团队列id
             gift_queue_id: res.data.data.callback.share_gift.gift_queue_id,
             //开团队列编号
             order_num: res.data.data.callback.share_gift.order_num
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
    that.header(app.globalData.url + 'openGiftSharing')
    wx.request({
      url: app.globalData.url +'openGiftSharing',
      method:'POST',
      header:that.data.header,
      data:{
        mall_goods_id:mall_goods_id
      },
      success:res=>{
        if(res.data.code == 200){
        app.share_relation = res.data.data.callback.share_relation;
         that.setData({
           share_relation: res.data.data.callback.share_relation
         })
          let gift_praise = res.data.data.callback.gift_praise;
          if(gift_praise){
            that.setData({
              addNum: Number(res.data.data.callback.give_num) - Number(gift_praise.length),
              gift_praise:gift_praise,
            })
          }else{
            that.setData({
              addNum: Number(res.data.data.callback.give_num) - 0,
              gift_praise:'',
            })

          }
        that.setData({
          //可赠送人数
          //上锁人数
          lockNum: Number(10) - Number(res.data.data.callback.give_num),
          //标识
          share_gift: res.data.data.callback.share_gift,
          timestamp: res.data.data.callback.share_gift.expire_time,
          //开团队列id
          gift_queue_id: res.data.data.callback.share_gift.gift_queue_id,
          //开团队列编号
          order_num: res.data.data.callback.share_gift.order_num
        })
        } else {
          // utils.error(res);
          this.show(res.data.msg);
          wx.navigateTo({
            url: '../Accredit/Accredit',
          })
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
    switch(state){
      case 0:
      this.openGiftSharing(this.data.mall_goods_id);
      break;
      case 1:
        this.show('级别不够无法解锁,赶紧升级吧~');
        break;
      case 2:
        this.Modal.showModal();
        break;
      case 3:
        this.show('暂不支持分享,维护中...')  

    }
  },
  _confirmEventFirst: function () {
    this.openGiftSharing(this.data.mall_goods_id)
    this.Modal.hideModal();
  },
  _cancelEvent: function () {
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

  /**
   * 
   * 用户点击右上角分享
   */
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (ops) {
    
    let gift_queue_id = this.data.gift_queue_id;
    let order_num = this.data.order_num;
    let name = this.data.giftGiving.member_oauth.nickname;
    let mall_goods_id = this.data.mall_goods_id;
    let goods = wx.getStorageSync('goods');
    let path = '/pages/EarnMoney/EarnMoney?gift_queue_id=' + gift_queue_id + '&order_num=' + order_num +'&goods='+ JSON.stringify(goods);
    console.log(path)
    let imageshare = this.data.imageshare;
    console.log(imageshare)
    
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