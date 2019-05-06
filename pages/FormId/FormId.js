// pages/FormId/FormId.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formIdArray:'',
  },

  saveFormId: function (v) {
    if (v.detail.formId != 'the formId is a mock one') {
      console.log(v.detail.formId)
    }
  },
  templateSend: function (e) {
    var openId ='of77M4njRdQvn8ifBLaOo6yJvuos';
    // 表单需设置report-submit="true"
    var formId = e.detail.formId; 
    var access_token = this.data.access_token;
    var data={
                "touser":openId,
                "template_id":"K4cJyYwhfQPNrAnbV9MWWRglpwUaa7HPM1qfQ2gXvNY",
                "form_id":formId,
                "page": "/pages/index/index",
                      "data": {
                          "keyword1": {
                            "value": "iNT"
                          },
                          "keyword2": {
                            "value": "2015年01月05日 12:30"
                          },
                        "keyword3": {
                          "value": "个人邀请"
                        }
                        },
                "emphasis_keyword": "keyword1DATA"
            }
            wx.request({
              url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+access_token,
              method:'post',
              data:data,
              header: {
                'content-type': 'json'
              },
              success:res=>{
                console.log(res)
              }
            })
    
  },

  //获取access_token
  getAccess(){
    let appId = 'wx05423f696872e38c';
    let secret = '1fff7b6ed7ac4d71ec772684cebc1420';
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
      data:{
        appid:appId,
        secret:secret
      },
      method:'get',
      header:{
        'content-type': 'json'
      },
      success:res=>{
        this.setData({
          access_token: res.data.access_token
        })
      },
      fail:res=>{
       
      }
    })
  },
  //发送模板消息

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let openid = wx.getStorageSync('openid');
    this.setData({
      openid:openid
    })
    this.getAccess();
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

  },
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