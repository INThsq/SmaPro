const app = getApp();
export default class ImageExample {
  palette(options) {
   const image = options.imges;
   const price = options.price;
   const tip = options.tip;
      var obj = {
        width: '630rpx',
        height: '490rpx',
        background: 'https://api.myzy.com.cn/api/images/20190410122419.jpg',
        views: [
          {
            type: 'image',
            url:`${image}`,
            css: {
              top: '16rpx',
              left: '16rpx',
              width: '350rpx',
              height: '350rpx',
            },
          },
          {
            type: 'text',
            text: "￥",
            css: [{
              color: '#CB2700',
              fontSize: '20px',
              top: `${startTop + 2 * gapSize}rpx`,
              fontWeight: 'bold',
            }, common, {  left:'400rpx', }],
          },
          {
            type: 'text',
            text:`${price}`,
            css: [{
              color: '#CB2700',
              fontSize: '60rpx',
              fontWeight: 'bold',

              top: `${startTop + 1.7 * gapSize}rpx`,
            }, common, { left: '440rpx' }],
          },
          {
            type: 'text',
            text:`${tip}`,
            css: [{
              color: '#CB2700',
              fontSize: '40rpx',
              fontWeight: 'bold',
              top: `${startTop + 2.8 * gapSize}rpx`,
            }, common, { left: '440rpx' }],
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
function _image(index, rotate, borderRadius) {
  return (
    {
      type: 'image',
      url: '/palette/avatar.jpg',
      css: {
        top: `${startTop + 8.5 * gapSize}rpx`,
        left: `${startLeft + 160 * index}rpx`,
        width: '120rpx',
        height: '120rpx',
        rotate: rotate,
        borderRadius: borderRadius,
      },
    }
  );
}

function _des(index, content) {
  const des = {
    type: 'text',
    text: content,
    css: {
      fontSize: '22rpx',
      top: `${startTop + 8.5 * gapSize + 140}rpx`,
    },
  };
  if (index === 3) {
    des.css.right = '60rpx';
  } else {
    des.css.left = `${startLeft + 120 * index + 30}rpx`;
  }
  return des;
}
