var util = require('md5.js');
const app = getApp();

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
function formatTime(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
//抛出异常
function error(res) {
  new app.ToastPannel();
  var erroe_code = res.data.code;
  switch (erroe_code) {
    case 5:
      wx.showToast({
        title:res.data.msg,
        icon:'none'
      })
      break;
    case 6:
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
      break;
  }
  wx.clearStorageSync('content');
  setTimeout(function () {
    wx.navigateTo({
      url: '../Accredit/Accredit',
    })
  }, 1500)

}
//全局跳转
function skip(url) {
  var content = wx.getStorageSync('content');
  if (content == '' || content == 'undefined') {
    wx.navigateTo({
      url: '../Accredit/Accredit',
    })
  } else {
    wx.navigateTo({
      url: url,
    })
  }
}
//分享
function onShareAppMessage(title, path, callback, imageUrl) {
  //设置一个默认分享背景图片
  let defaultImageUrl = 'http://oss.myzy.com.cn/wechat/images/wechat.png';
  return {
    title: title,
    path: path,
    imageUrl: imageUrl || defaultImageUrl,
    success(res) {
      console.log("转发成功！");
      if (!res.shareTickets) {
        //分享到个人
        api.shareFriend().then(() => {
          console.warn("shareFriendSuccess!");
          //执行转发成功以后的回调函数
          callback && callback();
        });
      } else {
        //分享到群
        let st = res.shareTickets[0];
        wx.getShareInfo({
          shareTicket: st,
          success(res) {
            let iv = res.iv
            let encryptedData = res.encryptedData;
            api.groupShare(encryptedData, iv).then(() => {
              console.warn("groupShareSuccess!");
              //执行转发成功以后的回调函数
              callback && callback();
            });
          }
        });
      }
    },
    fail: function (res) {
      console.log("转发失败！");
    }
  };
}


module.exports = {
  formatTime: formatTime,
  error: error,
  skip: skip,
  onShareAppMessage: onShareAppMessage
}