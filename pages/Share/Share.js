Page({
  data: {
    clickType: false,
    left: 0,
    interval: '',
    timestamp: 1543564642,
    hide:false,
    info: {
      time: '24:00:00',
      maxPrice: '8.00',
      price: '8.00',
      percent: '10',
      title: '好友助力团',
      ctitle: 'TA们刚刚提现了',
    },
    max: {
      imgSrc: 'http://oss.myzy.com.cn/wechat/images/touxiang.jpg',
      name: '会飞的猪',
      price: '8.00',
    },
    list: {},
    ylist: [
      { imgSrc: 'http://oss.myzy.com.cn/wechat/images/touxiang.jpg', name: '会飞的猪1', price: '8.00' },
      { imgSrc: 'http://oss.myzy.com.cn/wechat/images/touxiang.jpg', name: '会飞的猪2', price: '8.00' },
      { imgSrc: 'http://oss.myzy.com.cn/wechat/images/touxiang.jpg', name: '会飞的猪3', price: '8.00' },
      // { imgSrc: 'http://oss.myzy.com.cn/wechat/images/touxiang.jpg', name: '会飞的猪', price: '8.00' }
   
    ],
    clist: [
      { imgSrc: 'http://oss.myzy.com.cn/wechat/images/touxiang.jpg', name: '会飞的猪', time: '20', price: '8.00' },
      { imgSrc: 'http://oss.myzy.com.cn/wechat/images/touxiang.jpg', name: '会飞的猪', time: '20', price: '8.00' },
      { imgSrc: 'http://oss.myzy.com.cn/wechat/images/touxiang.jpg', name: '会飞的猪', time: '20', price: '8.00' },
      { imgSrc: 'http://oss.myzy.com.cn/wechat/images/touxiang.jpg', name: '会飞的猪', time: '20', price: '8.00' },
      { imgSrc: 'http://oss.myzy.com.cn/wechat/images/touxiang.jpg', name: '会飞的猪', time: '20', price: '8.00' },
      { imgSrc: 'http://oss.myzy.com.cn/wechat/images/touxiang.jpg', name: '会飞的猪', time: '20', price: '8.00' },
    ],
  },
  onLoad() {
    var that = this
    var list = that.data.list
    var ylist = that.data.ylist
    that.setData({
      list: ylist
    })
    that.progress();
    that.count();
  },
  //点击分享时间
  fxclick() {
    var that = this
    var list = that.data.list
    var clist = that.data.clist
    var info = that.data.info
    info.percent = ++info.percent
    that.setData({
      clickType: true,
      list: clist,
      info: info
    })
    that.progress();
  },
  // 进度条
  progress() {
    var that = this
    var percent = that.data.info.percent
    var left = 490 / 100 * percent
    that.setData({
      left: left
    })
  },
  //关闭红包
  ClosePacket(){
    this.setData({
      hide:true
    })
  },
  // 倒计时
  count() {
    var that = this
    var timestamp = that.data.timestamp
    var totalSecond = timestamp - Date.parse(new Date()) / 1000;

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
      if (totalSecond < 0) {
        clearInterval(that.data.interval);
        wx.showToast({
          title: '活动已结束',
          icon: 'none'
        });
        that.setData({
          dtime: '00:00:00'
        });
      }
    }.bind(this), 1000);
  },
  onUnload() {
    var that = this
    clearInterval(that.data.interval)
  },
  onHide() {
    var that = this
    clearInterval(that.data.interval)
  }
})