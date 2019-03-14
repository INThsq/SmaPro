let _compData = {
  '_toast_.isHide': false,// 控制组件显示隐藏
  '_toast_.content': ''// 显示的内容
}
let toastPannels = {
  // toast显示的方法
  shows: function (data) {
    let self = this;
    this.setData({ '_toast_.isHide': true, '_toast_.content': data });
    setTimeout(function () {
      self.setData({ '_toast_.isHide': false })
    }, 3000)
  }
}
function ToastPannels() {
  // 拿到当前页面对象
  let pages = getCurrentPages();
  let curPage = pages[pages.length - 1];
  this.__page = curPage;
  Object.assign(curPage, toastPannels);
  // 附加到page上，方便访问
  curPage.toastPannels = this;
  // 把组件的数据合并到页面的data对象中
  curPage.setData(_compData);
  return this;
}
module.exports = {
  ToastPannels
}