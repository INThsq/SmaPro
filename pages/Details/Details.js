var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var WxParse = require('../../components/wxParse/wxParse.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '商品详情',
    titleType: false,
    hideBottom: true,
    setInter: '',
    annoType: false,
    imgUrls: [],
    shopInfo: {
      shop_name: '',
      shop_img: '',
      shop_color: '',
      shop_size: '',
      shop_num: ''
    },
    sku_ids: '',
    shop_id: '',
    autoplay: false,
    interval: 5000,
    duration: 1000,
    swiperCurrent: 0,
    num: 1,
    modalInfo: '',
    // 使用data数据对象设置样式名
    minusStatus: 'disabled',
    //距离高度
    ScrollFlag: false,
    detail: '',
    gobug: false,
    skusss1: '',
    skusss2: '',
    goodsss: [],
    isShow:false
  },

  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  detail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../Details/Details?id=' + id,
    })
  },
  // 进入店铺
   EnterShop(e){
     let mall_id = e.currentTarget.dataset.id;
     app.mall_id = mall_id;
      wx.switchTab({
        url: '../CareShop/CareShop',
      })
 },
  //点击确认支付   
  buy: function () {
    let goods_sku = this.data.modalInfo.goods_sku;
    let id = this.data.shop_id;
    let sku_attr = this.data.sku_ids;
    let goods_num = this.data.num;
    console.log(this.data.num)
    let skus = '';
    let goods_len = this.data.goods_sku.length;
    switch(goods_len){
      case 1:
        if (this.data.skusss1 == '') {
        this.shows( '请选择' + this.data.goods_sku[0].name)
        }else{
            skus = {
            id: id,
            goods_num: goods_num,
            sku_attr: sku_attr
          }
          var content = wx.getStorageSync('content');
          if(content){
            this.settlement(id,sku_attr,goods_num)
          }else{
              wx.navigateTo({
                url: '../Accredit/Accredit',
              })
          }
       
        };
        break;
      case 2:
        if (this.data.skusss1 == '') {
          this.shows('请选择' + this.data.goods_sku[0].name)
         
        }else if(this.data.skusss2 == '') {
          this.shows('请选择' + this.data.goods_sku[1].name)
        }else{
          skus = {
            id: id,
            goods_num: goods_num,
            sku_attr: sku_attr
          }
          wx.setStorageSync('skus', skus);
          var content = wx.getStorageSync('content');
          if(content){
            this.settlement(id,sku_attr,goods_num)
          }else{
              wx.navigateTo({
                url: '../Accredit/Accredit',
              })
          }

        
        };
        break;
        
    
    
    }
   

  },
  //弹窗
  buys:function(){
    let goods_sku = this.data.modalInfo.goods_sku;
    if(goods_sku.length>0){
      this.showModal()
    }else{
      this.hideModal();
      let id = this.data.shop_id;
      let sku_attr = '';
      let goods_num = this.data.num;
      let skus = '';
      skus = {
        id: id,
        goods_num: goods_num,
        sku_attr: sku_attr
      }
      wx.setStorageSync('skus', skus)
      var content = wx.getStorageSync('content');
      if(content){
        this.settlement(id,sku_attr,goods_num)
      }else{
          wx.navigateTo({
            url: '../Accredit/Accredit',
          })
      }

    }
  },
  back: function () {
    let types = getApp().types;
    if(types == 2){
      wx.switchTab({
        url:'../index/index'
      })
    }else{
      wx.navigateBack({
        delta: 1,
      })
    }
    
  },
  //选择规格
  chooseSize() {
    if (this.data.modalInfo.goods_sku.length !== 0) {
      this.showModal();
    }

  },
  //点击我显示底部弹出框
  Confirm: function () {
    this.hideModal();
  },
  // 关闭模态框
  cloose: function (e) {
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
    let get = getApp().get;
    if(get == 1){
      this.showModal();
      app.get=0;
    }else{
      this.hideModal();
    }
    var id = options.id;
    var telephone_tip = wx.getStorageSync('telephone_tip');
    this.setData({
      telephone_tip:telephone_tip,
      shop_id: id,
      autoplay:true
    })
    this.getGoodsDetails(id);
    this.getGoodsSku(id);
    new app.ToastPannels();
  },
  //图片预览
  preview(e) {
    let index = e.currentTarget.dataset.index;
    let photos = this.data.imgUrls;
    wx.previewImage({
      current: photos[index], // 当前显示图片的http链接
      urls: photos,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.Modal = this.selectComponent("#modal");


  },
  calling: function (e) {
    this.Modal.showModal();
  },
  _confirmEventFirst: function () {
    this.Modal.hideModal();
    let phone = getApp().phone;
    wx.makePhoneCall({
      phoneNumber:phone, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  _cancelEvent: function () {
  },
  onPageScroll(e) {
    // 页面滚动的距离
    const scrollDistance = e.scrollTop
    this.setData({
      ScrollFlag: scrollDistance > 460
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
  //获取首页数据
  getGoodsDetails(id) {
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url+'getGoodsDetails');
    wx.request({
      url:app.globalData.url+'getGoodsDetails',
      method: 'GET',
      header: this.data.header,
      data: {
        goods_id: id
      },
      success: res => {
        this.setData({
          isShow:false
        })
        if (res.data.code == 200) {
          if (res.data.data.callback.mot_goods_num){
            this.setData({
              num:res.data.data.callback.mot_goods_num
            })
          }
          let content = res.data.data.callback.goods_details.mall_goods_describe.content;
          if(res.data.data.callback.goods_details.is_distribution == '1'||res.data.data.callback.goods_details.is_mall_dot == '1'||res.data.data.callback.goods_details.is_give_goods == '1'){
            this.setData({
              touch:false
            })
            wx.setStorageSync('touch',false)
          }else if(res.data.data.callback.goods_details.is_distribution == 0 && res.data.data.callback.goods_details.is_mall_dot == 0 && res.data.data.callback.goods_details.is_give_goods == 0){

            this.setData({
              touch:true
            })
            wx.setStorageSync('touch',true)

          }
          WxParse.wxParse('article', 'html', content, this, 5);
          this.setData({
            detail: res.data.data.callback,
            mall_id:res.data.data.callback.goods_details.member_mall.id,
            imgUrls: res.data.data.callback.goods_details.images
          })
        }else{
          utils.error(res);
        }
      }
    })
  },
  //列表跳转
  navCour(e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let type = e.currentTarget.dataset.type;
    switch (name) {
      case "promotion":
        wx.navigateTo({
          url: '../Sale/Sale?type=' + type,
        })
        break;
      case "gift":
        wx.navigateTo({
          url: '../Robmoney/Robmoney?type=' + type,
        })
        break;
      case "web":
        wx.navigateTo({
          url: '../Webview/Webview?h5=' + type,
        })
    }

  },
  //获取商品规格
  getGoodsSku(id) {
    var that = this;
    that.header(app.globalData.url+'getGoodsSku');
    wx.request({
      url:app.globalData.url+'getGoodsSku',
      method: 'GET',
      header: that.data.header,
      data: {
        goods_id: id
      },
      success: res => {
        if (res.data.code == 200) {

          that.setData({
            modalInfo: res.data.data,
            goods_sku: res.data.data.goods_sku,
            sku: res.data.data.goods_data,
          })
          if(res.data.data.goods_sku.length>1){
            this.setData({
              stock: res.data.data.goods_sku[0].children[0].stock
            })
          }

        }else{
          utils.error(res);
        }
      }
    })
  },
  //获取商品数据
  settlement(goods_id, sku_ids,goods_num) {
    app.sku_ids = sku_ids;
    app.goods_num = app.goods_num;
    var that = this;
    that.setData({
      isShow:true
    })
    that.header(app.globalData.url+'settlement');
    wx.request({
      url: app.globalData.url+'settlement',
      method: 'POST',
      header: this.data.header,
      data: {
          goods_id: goods_id,
          sku_ids: sku_ids,
          goods_num: goods_num
      },
      success: res => {
        that.setData({
          isShow:false
        })
        if (res.data.code == 200) {
          let mall = res.data.data.callback.mall_goods;
          let discount_money = res.data.data.callback.discount_money;
          console.log(res.data.data.callback.discount_money)
          let total = (Number(mall.market_price) - Number(mall.subsidy_money)) * (mall.goods_num) ;
          wx.setStorageSync('price', res.data.data.callback.mall_goods.sale_price);
          wx.setStorageSync('detail', res.data.data.callback);
          wx.setStorageSync('totalPrice', total.toFixed(2));
          wx.setStorageSync('market_price', mall.market_price);
          wx.setStorageSync('subsidy_money', mall.subsidy_money);
          wx.setStorageSync('goods_num', mall.goods_num);
          wx.setStorageSync('discount_money', discount_money);
          wx.setStorageSync('coupon_money', res.data.data.callback.coupon_money)
          
          wx.navigateTo({
            url: '../Confirm/Confirm?goods_id=' + goods_id,
          })
          app.types = 2;

         } 
          else{
            
          var erroe_code = res.data.code;
          switch (erroe_code) {
            case 5:
              this.shows(res.data.msg)
              wx.clearStorageSync('content');
              setTimeout(function () {
                wx.navigateTo({
                  url: '../Accredit/Accredit',
                })
              }, 3000)
              break;
            case 6:
              this.shows(res.data.msg)
              wx.clearStorageSync('content');
              setTimeout(function () {
                wx.navigateTo({
                  url: '../Accredit/Accredit',
                })
              },3000)
              break;
          }
          wx.clearStorageSync('content');
          setTimeout(function () {
            wx.navigateTo({
              url: '../Accredit/Accredit',
            })
          },3000)

        }
      }
    })
  },
  
  //选择规格
  choose: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var goods = this.data.goods_sku;
    var shop_id = this.data.shop_id;
    if (this.data.goods_sku[id].children[index].attr_ids == goods[id].attr_ids) {
      // goods[id].attr_ids = '';
      // goods[id].sku_idsname = '';
      if (id == 0) {
        this.setData({
          skusss1: goods[id].sku_idsname,
          skusid1: goods[id].attr_ids
        })
      } else {
        this.setData({
          skusss2: goods[id].sku_idsname,
          skusid2: goods[id].attr_ids
        })
      }

    } else {
      goods[id].attr_ids = this.data.goods_sku[id].children[index].attr_ids;
      goods[id].sku_idsname = this.data.goods_sku[id].children[index].name;
      if (id == 0) {
        this.setData({
          skusss1: goods[id].sku_idsname,
          skusid1: goods[id].attr_ids
        })
      } else {
        this.setData({
          skusss2: goods[id].sku_idsname,
          skusid2: goods[id].attr_ids
        })
      }
    }
    if (goods.length == 1) {
      var sku_ids =this.data.skusid1;
    } else {
      var sku_ids = this.data.skusid1 + ',' + this.data.skusid2;
    }
   
    if(goods.length ==1){
      if (this.data.skusid1 !== undefined){
          this.getSku(shop_id, sku_ids)
        }
    } else if (goods.length == 2){
      if (this.data.skusid1 !== undefined && this.data.skusid2 !== undefined) {
        this.getSku(shop_id, sku_ids)
      }
    }
    this.setData({
      goods_sku: goods,
      sku_ids: sku_ids
    })
  },
  //获取规格
  getSku(goods_id, sku_attr) {
    var that = this;
    that.header(app.globalData.url+'getSkuInfo');
    wx.request({
      url:app.globalData.url+'getSkuInfo',
      method: 'GET',
      header: that.data.header,
      data: {
        goods_id: goods_id,
        sku_attr: sku_attr
      },
      success: res => {
        if (res.data.code == 200) {
          that.setData({
            sku: res.data.data.sku_info,
            gobug: true,
            stock:res.data.data.sku_info.stock
          })
        }else if(res.data.code == 401){
          this.shows(res.data.msg)
          this.setData({
            code:401
          })
        } else if(res.data.code == 5||res.data.code == 6){
          this.shows(res.data.msg)
          wx.clearStorageSync('content');
          setTimeout(function () {
            wx.navigateTo({
              url: '../Accredit/Accredit',
            })
          }, 1500)
        }
        // else {
        //     utils.error(res);
        // }
      }
    })
  },
  //分享
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      swiperCurrent:0,
      autoplay:false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    that.setData({
      hideBottom: true,
      annoType: true,
      titleType: false,
    })
    wx.stopPullDownRefresh()
  },
  //上拉加载更多
  onReachBottom: function () {
    var that = this
    that.data.setInter = setInterval(
      function () {
        that.setData({
          hideBottom: false,
          annoType: false,
          titleType: true,
        })
        // wx.setNavigationBarTitle({
        //   title: '商品详情'
        // })
        that.clear();
      }, 500);
  },
  backes(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    });
    var that = this
    that.data.setInter = setInterval(
      function () {
        that.setData({
          hideBottom: true,
          annoType: true,
          titleType: false,
        })
        // wx.setNavigationBarTitle({
        //   title: '商品详情'
        // })
        that.clear();
      }, 500);
  },
  clear() {
    var that = this
    clearInterval(that.data.setInter)
  },
  onUnload() {
    var that = this
    that.clear();
  },
  onHide() {
    var that = this
    that.clear();
  }
})