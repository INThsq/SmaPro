// pages/Deposit/Deposit.js
var app = getApp();
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js'); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
     money:null,
    visible: false,
    showModalStatus: false,
    height:'',
    tool:false
  },
  money: function (e) {
    app.txmoney = e.detail.value;
    let moneys = e.detail.value;
    moneys = parseInt(moneys).toFixed(2)
    this.setData({
      money: e.detail.value,
      moneys:moneys
    })
  },
  // 关闭模态框
  hideTool(){
    this.setData({
        tool:false
    })
  },
  //提现
  putForward(cash_type){
    
    this.header(app.globalData.url + 'putForward');
    wx.request({
      url: app.globalData.url +'putForward',
      method:'get',
      header:this.data.header,
      data:{
        cash_type: cash_type
      },
      success:res=>{
        if(res.data.code == 200){
          let putForward = res.data.data.callback;

          let min_money = Number(putForward.min_money);
          let max_money = Number(putForward.max_money);
          this.setData({
            min_money: min_money,
            max_money: max_money
          })
          putForward.put_forward.money = Number(putForward.put_forward.money);
          if (putForward.put_forward.bank.length !=0){
            let bank = putForward.put_forward.bank[0];
            for (var p = 0; p < putForward.put_forward.bank.length; p++) {
              let len = putForward.put_forward.bank[p].bank_card.length;
              putForward.put_forward.bank[p].num = putForward.put_forward.bank[p].bank_card.substring(len - 4)
              putForward.put_forward.bank[p].bank_card = putForward.put_forward.bank[p].bank_card.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
              putForward.put_forward.bank[p].banks = putForward.put_forward.bank[p].bank_card.replace(/\s|\xA0/g, "");
            }
            this.setData({
              bank:bank
            })
          }else{
            let bank = putForward.put_forward.bank;
            this.setData({
              bank: bank,
            })
          }
          this.setData({
            putForward: putForward,
          })
        }
      }
    })
  },
  //点击赋值
  Choose(e){
    let index = e.currentTarget.dataset.id;
    let bank = this.data.putForward.put_forward.bank[index];
    this.setData({
      bank:bank
    })
    this.hideModal();
  },
  //继续提现
  Cash(e){
    let jump = this.data.jump;
    let money = this.data.money;

    // 微信提现 
    switch(jump){
      case "0":
        let cash_id = this.data.putForward.put_forward.member_oauth[0].id;
        this.cashForward(jump,money,cash_id)
      break;
      case "1":
        var cash_id = this.data.bank.id;
        this.cashForward(jump,money,cash_id)
      break;
    }

    //银行卡提现
  },
  //提现到账户
  cashForward(cash_type, money,cash_id) {
    this.setData({
      isShow:true
    })
    this.header(app.globalData.url + 'cashForward');
    let jump = this.data.jump;
    let header = this.data.header;
    let service = this.data.service;
    this.setData({
      ['header.content-type']: 'application/x-www-form-urlencoded',
    })
    wx.request({
      url: app.globalData.url + 'cashForward',
      method: 'POST',
      data: {
        cash_type: cash_type,
        money: money,
        cash_id: cash_id
      },
      header:header,
      success: res => {
        this.setData({
          isShow:false
        })
        if(res.data.code == 200){
          app.cookie = res.header['Set-Cookie'];
          if(jump == 0){
            wx.navigateTo({
              url: '../RechSucess/RechSucess?money='+money+'&msg='+res.data.data.callback.reminder,
            })
          }else{
            wx.navigateTo({
              url:'../Coindeposit/Coindeposit?money='+money+'&service='+service,
            })
          }
        }else{
          this.shows(res.data.msg);
          this.hideModal();
          this.setData({
            money:'',
            tool:false
          })
        }
      }
    })
  },
  //添加新卡
  toCard(){
    let content = wx.getStorageSync('content');
    let is_cards = content.data.content.userinfo.is_card;
    // 0未认证
    switch(is_cards){
        case 0:
         this.Modal.showModal();
        break;
        case 1:
        var  realname = content.data.content.userinfo.member_info.realname;
        let id_card = content.data.content.userinfo.member_info.id_card;
        wx.navigateTo({
          url: '../CardInfo/CardInfo?realname=' + realname + '&id_card=' + id_card,
        });
        break;
        //添加银行卡跳转路径  1提现  
        app.card_type = 1;
    }
   
  },
  _confirmEventFirst: function () {
    this.Modal.hideModal();
    wx.navigateTo({
      url: '../Certification/Certification',
    })

  },
  _cancelEvent: function () {
    this.Modal.hideModal();
  },
  //提现失败
  toDespositfalse:function(){
    let money = this.data.money;
    let min_money =Number(this.data.putForward.min_money);
    let min_tips = this.data.putForward.min_money_tips;
    let max_money = Number(this.data.putForward.max_money);
    let max_tips = this.data.putForward.max_money_tips;
    this.setData({
      min_money:min_money,
      max_money:max_money
    })
    if(money<min_money){
      this.shows(min_tips)
    }else if(money >max_money){
      this.shows(max_tips)
    }
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
  //服务费以及服务费计算
  Sum(){
    let money =this.data.money;
    money = parseInt(money).toFixed(2)
    let sum_money = this.data.putForward.put_forward.money;
    // 计算服务费方式
    let service_type =  this.data.putForward.service_type;
    let service_money = this.data.putForward.service_rate;
    let sum = '';
    let service = '';
    this.setData({
      service_type: service_type
    })
    // 1固定   2百分比
    switch(service_type){
      case 0 :
      this.setData({
        sum:Number(money),
        service:'免费',
      })
      break;
      case 1: 
        service = service_money;
        sum = (Number(money) - Number(service_money)).toFixed(2);
        let sums = Number(money)+Number(service_money);
        if( sums > Number(sum_money)||sums == Number(sum_money)){
          this.setData({
            sum: sum
          })
        }else{
          this.setData({
            sum: money
          })
        }
        this.setData({
          service: service,
        })
        break;
      case 2:
        service = (Number(money) * this.data.putForward.service_rate).toFixed(2);
        sum = (Number(money) - Number(service)).toFixed(2);
        console.log(sum)
        var sums = Number(money)+Number(service);
        if( sums > Number(sum_money)||sums == Number(sum_money)){
          this.setData({
            sum: sum
          })
        }else{
          this.setData({
            sum: money
          })
        }
        this.setData({
          service:service,
        })
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let jump = options.jump;
    this.setData({
      jump:jump
    })
    this.putForward(jump);
    new app.ToastPannels();

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

  },


  _onShowModal: function (e) {
    // this.Modal.showModal();
    this.setData({
      tool:true
    })
    this.Sum()
  }
})