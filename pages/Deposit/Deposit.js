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
   
  },
  money: function (e) {
    app.txmoney = e.detail.value;
    
    this.setData({
      money: e.detail.value,
     
    })
  },
  //提现
  putForward(){
    this.header(app.globalData.url + 'putForward');
    wx.request({
      url: app.globalData.url +'putForward',
      method:'get',
      header:this.data.header,
      success:res=>{
        if(res.data.code == 200){
          
          let putForward = res.data.data.content;
          putForward.put_forward.money = Number(putForward.put_forward.money);

          if (putForward.put_forward.bank.length !=0){
            let bank = putForward.put_forward.bank[0];

            for (var p = 0; p < putForward.put_forward.bank.length; p++) {
              let len = putForward.put_forward.bank[p].bank_card.length;
              console.log(putForward.put_forward.bank[p])
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
              bank: bank
            })
          }
          
         
          let height = (putForward.put_forward.bank.length + 3) * 100;

          this.setData({
            putForward: putForward,
            height:height
          })
        }
      }
    })
  },
  //点击赋值
  Choose(e){
    console.log(e);
    let index = e.currentTarget.dataset.id;
    let bank = this.data.putForward.put_forward.bank[index];
    this.setData({
      bank:bank
    })
  },
  //提现到账户
  cashForward(money, bank_id) {
    this.header(app.globalData.url + 'cashForward');
    let header = this.data.header;
    this.setData({
      ['header.content-type']: 'application/x-www-form-urlencoded',
    })
    wx.request({
      url: app.globalData.url + 'cashForward',
      method: 'POST',
      data: {
        money: money,
        bank_id: bank_id
      },
      header:header,
      success: res => {
        if(res.data.code == 200){
          app.cookie = res.header['Set-Cookie']
        }else{
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
        wx.navigateTo({
          url: '../BankCard/BankCard',
        });
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
  //提现失败
  toDespositfalse:function(){
   this.show('提现金额有误');
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
  onLoad: function (options) {
    this.putForward();
    new app.ToastPannel();

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
    this.Modal.showModal();

  },
  _confirmEventFirst: function () {
    let money = this.data.money;
    let bank_id = this.data.bank.banks;
    this.cashForward(money,bank_id)
    // wx.navigateTo({
    //   url: '../Coindeposit/Coindeposit?money=' + money + '&bank_id=' + bank_id,
    // })
    this.Modal.hideModal();
  },
  _cancelEvent: function () {
    this.show('取消提现')
  }
})