// pages/OpenShop/OpenShop.js
var util = require('../../utils/md5.js') 
var utils = require('../../utils/util.js') 
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: 'http://oss.myzy.com.cn/wechat/images/icon_kd_zhanweitu.png',
    shopname:'',
    //店铺长度
    shoplen:'',
    // base64码
    base64:'',  
    actionSheetItems: ['拍照','打开相册'],
    actionSheetHidden: true,
    currentTab: 0,
    // 经营类目
    currrntText:'请选择',
    itemChange:'',
    // 店铺类型
    types:1,
    res:'',
    price:'',
    menuTapCurrent:0,
    pay_type:1,
    isShow:false,
    type:0,
    choseQuestionBank:"点击选择",
    show: false,
    maskShow: false,
    value: [0],
    classify: '',
    index: 1,
    province: '点击选择'
  },
  //选择器
  choose() {
    this.setData({
      show: true,
      maskShow:true
    })
  },
  //滑动选择事件
  handleNYZAreaChange: function (e) {
    var that = this;
    var provinces = that.data.provinces;
    var value = e.detail.value;

    that.setData({
      value: value,
      province: provinces[value].name,
      classify: provinces[value].classify_id,

    })
  },
  //确定事件
  handleNYZAreaSelect: function (e) {
    var myEventDetail = e; // detail对象，提供给事件监听函数
    var myEventOption = {}; // 触发事件的选项
    var provinces = this.data.provinces;
    let value = this.data.value;
    let province = myEventDetail.currentTarget.dataset.province;
    let classify = myEventDetail.currentTarget.dataset.classify
    if (classify) {
      this.setData({
        province: myEventDetail.currentTarget.dataset.province,
        classify: myEventDetail.currentTarget.dataset.classify,
        show: false
      })
    } else {
      this.setData({
        province: provinces[0].name,
        classify: provinces[0].classify_id,
        show: false
      })
    }

  },
  //取消事件
  handleNYZAreaCancle: function (e) {
    var that = this;
    that.setData({
      show: false
    })
  },


  listenerButton: function () {
    this.setData({
      //取反
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  bindPickerChange: function (e) {
    var that=this
    this.setData({
     type: e.detail.value,
     choseQuestionBank: that.data.array[e.detail.value]
    })
  
   },
  listenerActionSheet: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  
  //保存input中的值
  shopname(e){
    let shoplen = e.detail.value;
    if(shoplen.length >=12){
      wx.showToast({
        title: '店铺输入不合法',
        icon:'none',
        duration:2000,
        mask:false
      })
    }
    this.setData({
      shopname:shoplen,
      shoplen:shoplen.length
    })
  },
  //选项卡效果
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    var text = event.currentTarget.dataset.text;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
        currrntText:text
        
      })
    }
  },
  //关闭慕态框
  close:function(){
    this.hideModal();
  },
  menuTaps: function (e) {
    let settlement_type = this.data.settlement_type;
    settlement_type = settlement_type.map(item => {
      item.is_default = false
      return item
    })
    this.setData({
     settlement_type: settlement_type
    })
    var current = e.currentTarget.dataset.current;//获取到绑定的数据
    if (settlement_type[current].is_disabled) {
    } else {
      var type = e.currentTarget.dataset.type;
      this.setData({
        menuTapCurrents: current,
        type: type
      });
    }
  },
  change:function(){
    this.showsModal();
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
  /**
   * 生命周期函数--监听页面加载
   */
  itemChange(e) {
    var text = e.target.dataset.text;
    var that = this;
    that.setData({
      actionSheetHidden:true
    })
    if (text == '拍照') {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res=>{
          //设置头像  本地路径
            let tempFilePaths = res.tempFilePaths
            that.setData({
                avatarUrl: tempFilePaths
              })
          //图片转码base64
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePaths[0], //选择图片返回的相对路径
              encoding: 'base64', //编码格式
              success: res => { //成功的回调
                that.setData({
                  base64:res.data
                })
              }
            })
          
        }
      })
    } else {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          //设置头像  本地路径
          let tempFilePaths = res.tempFilePaths
          that.setData({
            avatarUrl: tempFilePaths
          })
          //图片转码base64
          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[0], //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
              that.setData({
                base64: res.data
              })
            }
          })

        }
      })
    }
  },
//验证以及请求
  topay(){
    var content = wx.getStorageSync('content');
      this.setData({
        isShow: true
      })
      this.header(app.globalData.url + 'storePayment')
      var data = {
        classify_name:this.data.province,
        logo: 'data: image/png;base64,' + this.data.base64,
        name: this.data.shopname,
        auth_type: 1,
        classify_id: this.data.classify,
        type: this.data.types,
        pay_type: this.data.pay_type,
        total_fee: this.data.price,
        telephone: '17600784408'
      }
      wx.request({
        url: app.globalData.url + 'storePayment',
        method: 'POST',
        header: this.data.header,
        data: data,
        success: res => {
          this.setData({
            isShow: false
          })
          if (res.data.code == 200) {
            wx.setStorageSync('member_mall', true)
            let pay_type = this.data.pay_type;
            // 余额支付
            if (pay_type == 1) {
              this.shows(res.data.msg)
                wx.navigateTo({
                  url: '../Setted/Setted',
                })
             
            } else if (pay_type == 3) {

              // 微信支付
              let payment = res.data.data.callback;
              //调起微信支付
              wx.requestPayment({
                timeStamp: payment.timeStamp,
                nonceStr: payment.nonceStr,
                package: payment.package,
                signType: payment.signType,
                paySign: payment.paySign,
                success(res) {
                  wx.setStorageSync('member_mall', true)
                  this.setData({
                    isShow: false
                  })
                  if (res.errMsg == "requestPayment:ok") {

                    setTimeout(function () {
                      wx.navigateTo({
                        url: '../Setted/Setted',
                      })
                    }, 500)
                  }
                }
              })
            }
          } else if(res.data.code == 401){
            this.shows(res.data.msg)
          }else {
            this.shows(res.data.msg);
            wx.navigateTo({
              url: '../Accredit/Accredit',
            })
          }
        }
      })
   
  },
  
 
  //跳转
  setted(e){

    var type = e.currentTarget.dataset.type;
    if (this.data.avatarUrl == 'http://oss.myzy.com.cn/wechat/images/icon_kd_zhanweitu.png'){
      this.shows('请选择上传头像')
    }
    else if (this.data.shopname == '') {
      this.shows('店铺名称不能为空')
      }
      else if (this.data.shoplen >= 12) {
        this.shows( '店铺输入不合法')
        }
        else{
      this.showModal();
      if(type == 1){
        this.setData({
          price: this.data.res.data.set_store.store_type[1].price
        })
      }else{
        this.setData({
          price: this.data.res.data.set_store.store_type[0].price
        })  
      }
    }
   
  },
  //选择类型
  menuTap: function (e) {
    var current = e.currentTarget.dataset.current;//获取到绑定的数据
    var types = e.currentTarget.dataset.type;
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrent: current,
      types:types
    });
  },
  onLoad: function (options) {
    let res = JSON.parse(options.res);
    console.log(res.data.set_store.classify)
    this.setData({
      res: res,
      settlement_type: res.data.set_store.settlement_type,
      provinces: res.data.set_store.classify
    })
    new app.ToastPannels();
  },
//获取页面数据
  getJson() {
    var that = this;
    that.header(app.globalData.url+'setStore');
    wx.request({
      url:app.globalData.url+'setStore',
      method: 'GET',
      header:that.data.header,
      success: res => { 
        if(res.data.code == 200){
          this.setData({
            settlement_type: res.data.set_store.settlement_type,
            res:res.data,
            provinces:res.data.data.set_store.classify
          })
        }else{
          utils.error(res);
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