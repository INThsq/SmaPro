export default class ImageExample {
  palette(options) {
  const money = options.money;
      var obj = {
        width: '550rpx',
        height: '448rpx',
        background: 'https://huixuangou.oss-cn-beijing.aliyuncs.com/wechat/images/linghuobao copy 3.jpg',
        views: [
          {
            type: 'text',
            text: '助力领现金',
            css: [{
              top: `${startTop + 30}rpx`,
              align: 'center',
              width: '400rpx',
              color: '#B05B0B',
              fontSize: '56rpx',
              fontWeight: 'bold',
            }, common, { left: '300rpx' }],
          },
          {
            type: 'text',
            text: "￥",
            css: [{
              color: '#FB0007',
              fontSize: '48rpx',
              top: `${startTop + 2 * gapSize}rpx`,
              fontWeight: 'bold',
            }, common, { left: '120rpx' }],
          },
          {
            type: 'text',
            text: `${money}`,
            css: [{
              color: '#FB0007',
              fontSize: '80rpx',
              top: `${startTop + 1.6 * gapSize}rpx`,
              fontWeight: 'bold',
            }, common, { left: '170rpx' }],
          },
          {
            type: 'text',
            text: "提现",
            css: [{
              color: '#262626',
              fontSize: '32rpx',
              top: `${startTop + 2.2 * gapSize}rpx`,
              fontWeight: 'bold',
            }, common, { left: '400rpx' }],
          },
          {
            type: 'text',
            text: "帮",
            css: [{
              color: '#ffffff',
              fontSize: '60rpx',
              top: `${startTop + 3.3 * gapSize}rpx`,
              fontWeight: 'bold',
            }, common, { left: '246rpx' }],
          },

        ],
      }
     return obj;
  }
}

const startTop = 50;
const startLeft = 20;
const gapSize = 70;
const a = 'ssss'
const common = {
  left: `${startLeft}rpx`,
};