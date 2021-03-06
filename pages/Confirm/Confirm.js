// pages/Confirm/Confirm.js
var app = getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    minusStatus: 'disabled',
    num:'',
    totalPrice:0,
    price:'',
    menuTapCurrent:'0',
    nedPay:'0',
    detail:'',
    type:3,
    isShow: false,
    totalFlag:1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let types =getApp().types;
    
    var flag = false;
    flag = options.flag;
    new app.ToastPannels();
    if(types == 1){
      var detail = wx.getStorageSync('details');
      var totalPrice = wx.getStorageSync('totalPrice');
      var discount_money = wx.getStorageSync('discount_money');
      var virtual_money = detail.virtual_money;
      var residue = (Number(virtual_money) - Number(discount_money)).toFixed(2);
      var goods_num = detail.mall_goods.goods_num;
      this.setData({
          num:goods_num,
          detail:detail,
          totalPrice:totalPrice,
          residue:residue,
          types:types
      })
    }else{
      var detail = wx.getStorageSync('detail');
      var totalPrice = wx.getStorageSync('totalPrice');
      var discount_money = wx.getStorageSync('discount_money');
      var virtual_money = detail.virtual_money;
    
      var residue = (Number(virtual_money) - Number(discount_money)).toFixed(2);
      var goods_num = detail.mall_goods.goods_num;
      // this.totalPrice();
      this.setData({
        num: goods_num,
        detail: detail,
        totalPrice: totalPrice,
        residue: residue
      })
    }
    
    if(flag){
        var ad = {
          'realname':options.realname,
          'mobile':options.mobile,
          'address':options.address,
          'id':options.id
        }
        var detail = 'detail.address'
        this.setData({
            [detail]:ad
        })
    }
    
  },
  //选择类型
  menuTap: function (e) {
    var current = e.currentTarget.dataset.current;//获取到绑定的数据
    var type = e.currentTarget.dataset.type;
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrent: current,
      type:type
    });
    var chooseAddress = wx.getStorageSync('chooseAddress');
    
  },
  //选择地址
  addAdress(e){
    wx.navigateTo({
      url: '../Address/Address',
    })
    app.chooseType = 1;
    // var chooseAddress = getApp().chooseAddress;
  },
  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减
    if (num > 1){
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
    this.totalPrice();
  },
  //点击到商品详情
  details(){
    wx.navigateTo({
      url: '../Details/Details',
    })
  },
  //总额
  totalPrice(){
      let total = '';
      let totalFlag = this.data.totalFlag;
      let price = wx.getStorageSync("price");
      let market_price = wx.getStorageSync("market_price");
      let subsidy_money = wx.getStorageSync("subsidy_money");
      let types = getApp().types;
      let discount_money = wx.getStorageSync("discount_money");
      switch(totalFlag){
        case 1:
          total = (Number(market_price) - Number(subsidy_money)) * (this.data.num);
          this.setData({
            totalPrice: total.toFixed(2)
          })
          break;
        case 0 :
          total = (Number(market_price) - Number(subsidy_money)) * (this.data.num) - Number(discount_money);
          this.setData({
            totalPrice: total.toFixed(2)
          })
          break;
      }
      
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    this.setData({
      num: num,
    });
    this.totalPrice();
    
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回
    this.setData({
      num: num
    });
    this.totalPrice();
  },
  //点击弹出支付方式
  submits:function(e){
    if(this.data.detail.address == null){
      this.shows('请选择您的收货地址')
     
    }else{
      this.showModal();

    }
  }, 
  //swtich状态更改
  checkboxChange(e) {
    if (e.detail.value) {

      this.setData({
        totalFlag:0,
        'addressDetails.sa_addr_true': 0
      })
    } else {
      this.setData({
        totalFlag: 1,
        'addressDetails.sa_addr_true': 1
      })
    }
    this.totalPrice();
  },
  //jump_type为1查看订单的跳转方式
  paymentInfo(order_num, mall_goods_id, mall_sku_id) {
    var that = this;
    that.header(app.globalData.url + 'paymentInfo');
    wx.request({
      url: app.globalData.url + 'paymentInfo',
      method: 'GET',
      header: that.data.header,
      data: {
        order_num: order_num,
        mall_goods_id: mall_goods_id,
        mall_sku_id: mall_sku_id
      },
      success: res => {
       
        if (res.data.code == 200) {
          this.setData({
            isShow: false
          })
          var paymentInfo = res.data;
          switch (paymentInfo.data.callback.pay_type) {
            case 1:
              paymentInfo.data.callback.pay_type = "余额支付";
              break;
            case 3:
              paymentInfo.data.callback.pay_type = "微信支付";
          }
          paymentInfo.data.callback.pay_time = utils.formatTime(paymentInfo.data.callback.pay_time, 'Y-M-D h:m:s')
          wx.navigateTo({
            url: '../Payment/Payment?paymentInfo=' + JSON.stringify(paymentInfo),
          })
        }else if(res.da.code == 401){
          wx.navigateTo({
            url: '../Error/Error',
          })
        }
      }
    })
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
  close:function(){
    this.hideModal();
    this.shows('已取消支付');
  },
  //支付
  topay:function(){
      this.setData({
          isShow:true
        })
      let totalFlag = this.data.totalFlag;
      let is_discount = totalFlag;
      if(totalFlag == '0'){
          is_discount = 1
      }else{
        is_discount = 0
      }
      let data = {
        mall_sku_id: this.data.detail.mall_goods.mall_sku_id,
        member_address_id: this.data.detail.address.id,
        total_fee: this.data.totalPrice,
        goods_num: this.data.num,
        pay_type: this.data.type,
        is_discount:is_discount
      }
      //判断支付方式
      let pay_type = Number(this.data.type);
      let jump_type = this.data.detail.jump_type;
      //余额支付
       switch (pay_type){
        case 1:
        this.toBalance(data);
        break;
        //微信支付
        case 3:
          this.header(app.globalData.url + 'goodsPayment');
          wx.request({
            url: app.globalData.url + 'goodsPayment',
            method: 'POST',
            header: this.data.header,
            data: data,
            success: res => {
              if(res.data.code == 200){
                
                let payment = res.data.data.callback.payment;
                let mall_order = res.data.data.callback.mall_order;
                wx.setStorageSync('mall_order', mall_order) 
                this.hideModal();
                //调起微信支付
                wx.requestPayment({
                  timeStamp: payment.timeStamp,
                  nonceStr: payment.nonceStr,
                  package: payment.package,
                  signType: payment.signType,
                  paySign: payment.paySign,
                  success(res) {
                    if (res.errMsg == "requestPayment:ok") { 
                    setTimeout(()=>{
                      switch (jump_type) {
                        case 2:
                          wx.navigateTo({
                            url: '/pages/Share/Share?mall_sku_id=' + mall_order.mall_sku_id + '&total_fee=' + mall_order.total_fee + '&goods_num=' + mall_order.goods_num + '&order_num=' + mall_order.order_num + '&mall_goods_id=' + mall_order.mall_goods_id + '&is_discount=' + mall_order.is_discount,
                          });
                          this.setData({
                            isShow: false
                          })
                          break;
                        case 1:
                          this.paymentInfo(mall_order.order_num, mall_order.mall_goods_id, mall_order.mall_sku_id)

                          break;
                        //3 进入分佣中心
                        case 3:
                          wx.navigateTo({
                            url: '../FyCenter/FyCenter',
                          })
                        break;
                      }
                    },2000)
                   
                    }else{
      
                      this.show('已取消订单支付')
                    }
                    
                  },
                  fail(res) {
                    app.tz = 1;

                    wx.navigateTo({
                      url: '../Order/Order?state=1',
                    })
                  }
                })
              } else if (res.data.code == 401) {
                wx.navigateTo({
                  url: '../Error/Error',
                })
              }
            
            }
          })
            break;
        
      }
  },
  
  toBalances(datas){
    this.header(app.globalData.url + 'orderPayment');
    let jump_type = this.data.detail.jump_type;
    wx.request({
      url: app.globalData.url + 'orderPayment',
      method: 'POST',
      header: this.data.header,
      data: datas,
      success: res => {
        
         if(res.data.code == 200){
           
          //  this.show(res.data.msg);
           var mall_order =res.data.data.callback.mall_order; 
           wx.setStorageSync('mall_order', mall_order)
          setTimeout(()=>{
           switch(jump_type){
             case 2:
               
               wx.navigateTo({
                 url: '../Share/Share?mall_sku_id=' + mall_order.mall_sku_id + '&total_fee=' + mall_order.total_fee + '&goods_num=' + mall_order.goods_num + '&order_num=' + mall_order.order_num + '&mall_goods_id=' + mall_order.mall_goods_id + '&is_discount=' + mall_order.is_discount,
               });
               this.setData({
                 isShow: false
               })
               break;
             case 1:
               this.paymentInfo(mall_order.order_num, mall_order.mall_goods_id, mall_order.mall_sku_id)


             break;
             //3 进入分佣中心
             case 3:
               wx.navigateTo({
                 url: '../FyCenter/FyCenter',
               })
               break;
           }
           },2000)

         } else if (res.data.code == 401) {
          
         }else{
           this.setData({
             isShow: false
           })
           var code = res.data.code;
          switch(code){
            case 401:
            this.shows(res.data.msg);
            break;
             case 5:
              this.shows(res.data.msg);
               wx.clearStorageSync('content');
               setTimeout(function () {
                 wx.navigateTo({
                   url: '../Accredit/Accredit',
                 })
               }, 1500)
               break;
             case 6:
              this.shows(res.data.msg);
               wx.clearStorageSync('content');
               setTimeout(function () {
                 wx.navigateTo({
                   url: '../Accredit/Accredit',
                 })
               }, 1500)
               break;
            

           }

          }

         }
        })
  },
  //待支付订单支付
   topays:function(){
     this.setData({
       isShow: true
     })
      let totalFlag = this.data.totalFlag;
      let is_discount = totalFlag;
      if(totalFlag == '0'){
          is_discount = 1
      }else{
        is_discount = 0
      }
      let data = {
        
        member_address_id: this.data.detail.address.id,
        total_fee: this.data.totalPrice,
        goods_num: this.data.num,
        pay_type: this.data.type,
        is_discount:is_discount,
		mall_order_id:this.data.detail.mall_order.id,
		order_num:this.data.detail.mall_order.order_num,
      }
      //判断支付方式
      let pay_type = Number(this.data.type);
      let jump_type = this.data.detail.jump_type;
      //余额支付
       switch (pay_type){
        case 1:
        this.toBalances(data);
        break;
        //微信支付
        case 3:
          this.header(app.globalData.url + 'orderPayment');
          wx.request({
            url: app.globalData.url + 'orderPayment',
            method: 'POST',
            header: this.data.header,
            data: data,
            success: res => {
              
              if(res.data.code == 200){
                let payment = res.data.data.callback.payment;
                let mall_order = res.data.data.callback.mall_order;
                wx.setStorageSync('mall_order', mall_order) 
                this.hideModal();
                //调起微信支付
                wx.requestPayment({
                  timeStamp: payment.timeStamp,
                  nonceStr: payment.nonceStr,
                  package: payment.package,
                  signType: payment.signType,
                  paySign: payment.paySign,
                  success(res) {
                    if (res.errMsg == "requestPayment:ok") { 
                    setTimeout(()=>{
                      switch (jump_type) {
                        case 2:
                          wx.navigateTo({
                            url: '/pages/Share/Share?mall_sku_id=' + mall_order.mall_sku_id + '&total_fee=' + mall_order.total_fee + '&goods_num=' + mall_order.goods_num + '&order_num=' + mall_order.order_num + '&mall_goods_id=' + mall_order.mall_goods_id + '&is_discount=' + mall_order.is_discount,
                          });
                          this.setData({
                            isShow: false
                          })
                          break;
                        case 1:
                          this.paymentInfo(mall_order.order_num, mall_order.mall_goods_id, mall_order.mall_sku_id)


                          break;
                        //3 进入分佣中心
                        case 3:
                          wx.navigateTo({
                            url: '../FyCenter/FyCenter',
                          })
                          break;
                      }
                    },2000)
                   
                    }else{
      
                      this.shows('已取消订单支付')
                    }
                    
                  },
                  fail(res) {
                    app.tz = 1;
                      wx.navigateTo({
                        url: '../Order/Order?state=1',
                      })
                  }
                })
              } else if (res.data.code == 401) {
                wx.navigateTo({
                  url: '../Error/Error',
                })
              }
            
            }
          })
            break;
        
      }
  },
  //余额支付
  toBalance(datas){
    this.header(app.globalData.url + 'goodsPayment');
    let jump_type = this.data.detail.jump_type;
    wx.request({
      url: app.globalData.url + 'goodsPayment',
      method: 'POST',
      header: this.data.header,
      data: datas,
      success: res => {
        
         if(res.data.code == 200){
           var mall_order =res.data.data.callback.mall_order; 
           wx.setStorageSync('mall_order', mall_order)
          setTimeout(()=>{
           switch(jump_type){
             case 2:
               wx.navigateTo({
                 url: '../Share/Share?mall_sku_id=' + mall_order.mall_sku_id + '&total_fee=' + mall_order.total_fee + '&goods_num=' + mall_order.goods_num + '&order_num=' + mall_order.order_num + '&mall_goods_id=' + mall_order.mall_goods_id + '&is_discount=' + mall_order.is_discount,
               });
               this.setData({
                 isShow: false
               })
               break;
             case 1:
               this.paymentInfo(mall_order.order_num, mall_order.mall_goods_id, mall_order.mall_sku_id)
             break;
             //3 进入分佣中心
             case 3:
               wx.navigateTo({
                 url: '../FyCenter/FyCenter',
               })
               break;
           }
           },2000)

         } else if (res.data.code == 401) {
           wx.navigateTo({
             url: '../Error/Error',
           })
         }else{
           this.setData({
             isShow: false
           })
           var code = res.data.code;
          switch(code){
            case 401:
            this.shows(res.data.msg);
            break;
             case 5:
              this.shows(res.data.msg);
               wx.clearStorageSync('content');
               setTimeout(function () {
                 wx.navigateTo({
                   url: '../Accredit/Accredit',
                 })
               }, 1500)
               break;
             case 6:
              this.shows(res.data.msg);
               wx.clearStorageSync('content');
               setTimeout(function () {
                 wx.navigateTo({
                   url: '../Accredit/Accredit',
                 })
               }, 1500)
               break;
            //3 进入分佣中心
            case 3:
              wx.navigateTo({
                url: '../FyCenter/FyCenter',
              })

           }

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
        "logintype":logintype
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.totalPrice();
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