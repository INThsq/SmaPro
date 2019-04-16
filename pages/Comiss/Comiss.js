var app = getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js'); 

Page({
  data: {
    selected: true,
    selected1: false,
    num:0,
    del:true,
    picture:'http://oss.myzy.com.cn/wechat/images/icon_xiala_xia.png',
    up:'下拉加载更多~'
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  //选择位置位置
  chooseLocation: function (e) {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        // success
        console.log(res)
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },
  Sq(){
    wx.navigateTo({
      url: '../Explain/Explain',
    })
  },
  Tj() {
    wx.navigateTo({
      url: '../Recom/Recom',
    })
  },
  //下拉刷新
  onReachBottom(){
    let now_page = this.data.now_page;
    now_page++;
    this.header(app.globalData.url + 'giveaway');
    wx.request({
      url: app.globalData.url + 'giveaway',
      method: 'get',
      header: this.data.header,
      data: {
        keywords: keywords,
        now_page: now_page
      },
      success: res => {
        if (res.data.code == 200) {
          let lists = this.data.list;
          let list = res.data.data.callback.list;
          if(list.length<1){
            this.setData({
              up:'暂时没有更多了~'
            })
          }else{

            for (let l = 0; l < list.length; l++) {
              lists.push(list[l])
            }
            for(let p =0;p<lists.length;p++){
              let welfare = lists[p].welfare;
              let we = [];
              if (welfare) {
                for (let n = 0; n < welfare.length; n++) {
                  we.push(welfare[n].split('|'));
                }
                lists[l].welfare = we;
              }
            }
            this.setData({
              list:lists,
              up:'下拉加载更多~'
            })
            
          }
        }
      }
    })
  },
  //赠送商家入驻
  activity() {
    this.header(app.globalData.url + 'activity');
    wx.request({
      url: app.globalData.url + 'activity',
      method: 'get',
      header: this.data.header,
      success: res => {
        if (res.data.code == 200) {
          let type = res.data.data.callback.type;
          switch (type) {
            case 0:
              app.scenes = 1;
              wx.setStorageSync('datas', res.data.data.callback)
              wx.navigateTo({
                url: '../jjb/jjb?data=' + JSON.stringify(res.data.data.callback),
              })
              break;
            case 1:
              wx.navigateTo({
                url: '../FyCenter/FyCenter',
              })
              app.scenes = 0;
              break;
          }
        } else {
          this.show(res.data.code)
        }
      }
    })
  },
  //搜索关键词
  searchSubmitFn(e){
    let keyword = this.data.searchValue;
    this.giveaway(keyword,1)
  },
  //进入活动
  ComeAct(){
    this.activity();
  },
  //进入门店中心
  ComeCenter:utils.throttle(function (e){
    this.switchDotCenter();
  },1000),
  //门店管理
  switchDotCenter() {
    this.setData({
      isShow:true
    })
    let content = wx.getStorageSync('content');
    if (content) {
      this.header(app.globalData.url + 'switchDotCenter');
      wx.request({
        url: app.globalData.url + 'switchDotCenter',
        method: 'get',
        header: this.data.header,
        success: res => {
          this.setData({
            isShow:false
          })
          if (res.data.code == 200) {
            if (res.data.data.callback.length < 1) {
              this.shows('您还未开通相关门店,请前去开通或联系客服')
            } else {
              wx.navigateTo({
                url: '../WhitCenter/WhitCenter?list=' + JSON.stringify(res.data.data.callback),
              })
            }
          } else {
            utils.error(res);
          }
        }
      })
    } 
  },
  //展开福利
  Sum(){
    let num = this.data.num;
    if(num == 0){
      this.setData({
        num:1,
        picture: 'http://oss.myzy.com.cn/wechat/images/icon_xiala_shang.png'

      })
    }else{
      this.setData({
        num:0,
        picture:'http://oss.myzy.com.cn/wechat/images/icon_xiala_xia.png'
      })
    }
  },
  //获取input 内值
  keyword(e) {
    let val = e.detail.value;
    if (val.length > 0) {
      this.setData({
        del: false,
        searchValue: val
      })
    } else {
      this.setData({
        del: true,
      })
    }
    if (val.length > 12) {
      this.show('您输入的内容太长,建议在20字以内哦~')
    }
  },
  //删除
  del() {
    this.setData({
      searchValue: '',
      del: true
    })
  },
  Come(){
    wx.navigateTo({
      url: '../FyCenter/FyCenter',
    })
  },
  //赠送活动
  giveaway(keywords, now_page){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url +'giveaway');
    wx.request({
      url: app.globalData.url +'giveaway',
      method:'get',
      header:this.data.header,
      data:{
        keywords:keywords,
        now_page:now_page
      },
      success:res=>{
        this.setData({
          isShow:false
        })
        if(res.data.code == 200){
          let list  = res.data.data.callback.list;
          if(list.length>0||list.length<10){
            for (let l = 0; l < list.length; l++) {
              let welfare = list[l].welfare;
              let we = [];
              if(welfare){
                for (let n = 0; n < welfare.length; n++) {
                  we.push(welfare[n].split('|'));
                }
                res.data.data.callback.list[l].welfare = we;

              }
              this.setData({
                list: list,
                up: '暂时没有更多内容了~',
                 now_page: res.data.data.callback.now_page,
              })
            }
          }        
        }
      }
    })
  },
  onLoad(){
    this.giveaway('',1);
    new app.ToastPannels();
  },
  Tj(e){
    let id = e.target.dataset.id;
    this.getMallDot(id);
  },
  //自提点
  getMallDot(member_mall_id){
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url +'getMallDot');
    wx.request({
      url: app.globalData.url +'getMallDot',
      header:this.data.header,
      data:{
        member_mall_id: member_mall_id
      },
      method:'get',
      success:res=>{
        this.setData({
          isShow:false
        })
           if(res.data.code==200){
             let mall = res.data.data.callback.mall_dot;
             let url = '../JiujiaB/JiujiaB?member_mall_id=' + mall.member_mall_id + '&money=' + mall.money + '&telephone=' + mall.telephone + '&name=' + mall.name + '&money=' + mall.money + '&account_balance=' + res.data.data.callback.account_balance + '&buy_tips=' + res.data.data.callback.buy_tips;
             app.jjb=1;
            wx.navigateTo({
              url:url,
            })
           }else{
             this.shows(res.data.msg);
            
           }
      }
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

})