//index.js
//获取应用实例
var util = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
var app = getApp()
Page({
	data: {
		usrState: null,
		//用户信息
		userInfo: '',
		money: '',
		points: '',
		//粉丝
		fans_order_total: '',
		//粉丝订单
		fans_total: '',
		//订单参数
		order_total: '',
		//未领礼物
		receive_total: '',
		mobile: '',
		content: '',
		virtual_money: ''
	},
	Steed(e) {
		let name = e.currentTarget.dataset.name;
    let type = e.currentTarget.dataset.type;
    let types = e.currentTarget.dataset.types;

    switch(type){

      case "gift":
        wx.navigateTo({
          url: '../Robmoney/Robmoney?type=2',
        })
        break;
     
      case "market":
        let content = wx.getStorageInfoSync('content');
        if (!content) {
          wx.navigateTo({
            url: '../jjb/jjb',
          })
        }
        this.activity(type)
        break;

      case "malldot":
        this.switchDotCenter();
        break;

      case "enterdot":
        wx.navigateTo({
          url: "../JiujiaB/JiujiaB?id=" + e.currentTarget.dataset.types
        })
        break;
    }


		switch (name) {
			case "商家入驻":
				wx.navigateTo({
					url: "../Setted/Setted"
				})
				break;
			case "店铺管理":
				wx.navigateTo({
					url: '../Setted/Setted',
				})
				break;
			case "顾问编号":
				let content = wx.getStorageSync('content');
				if (content) {
					this.getCode();
				} else {
					wx.navigateTo({
						url: '../Accredit/Accredit',
					})
				}
		}

	},
  // 分销中心
  distribution(member_mall_id) {
    var scenes = 0;
    var data = {};
    switch (scenes) {
      // 非订单验证
      case 0:
        data = {
          scene: 0,
          order_num: '',
          goods_id: 0,
          member_mall_id: 0
        }
        break;
      // 订单验证
      case 1:
        let goods_id = this.data.goods_id;
        let mall_goods_id = this.data.mall_goods_id;
        let order_num = this.data.order_num;
        data = {
          scene: 1,
          goods_id: goods_id,
          mall_goods_id: mall_goods_id,
          order_num: order_num
        }
        break;
    }
    this.header(app.globalData.url + 'distribution');
    wx.request({
      url: app.globalData.url + 'distribution',
      header: this.data.header,
      method: 'get',
      data: data,
      success: res => {
        if (res.data.code == 200) {
          wx.setStorageSync('data', data)
          app.data = data
          wx.navigateTo({
            url: '../FyCenter/FyCenter?top=' + JSON.stringify(res.data.data.callback)
          })

        } else {
          this.show(res.data.msg)
        }
      }
    })
  },
  //赠送商家入驻
  activity(member_mall_id) {
    this.header(app.globalData.url + 'activity');
    wx.request({
      url: app.globalData.url + 'activity',
      method: 'get',
      data: {
        member_mall_id: member_mall_id
      },
      header: this.data.header,
      success: res => {
        if (res.data.code == 200) {
          let type = res.data.data.callback.type;
          switch (type) {
            case 0:
              app.scenes = 1;
              wx.setStorageSync('datas', res.data.data.callback)
              wx.navigateTo({
                url: '../jjb/jjb?data=' + JSON.stringify(res.data.data.callback),
              })
              break;
            case 1:
              this.distribution('')
              app.scenes = 0;
              break;
          }
        } else {
          this.show(res.data.code)
        }
      }
    })
  },
  switchDotCenter() {
    let content = wx.getStorageSync('content');
    if (content) {
      this.header(app.globalData.url + 'switchDotCenter');
      wx.request({
        url: app.globalData.url + 'switchDotCenter',
        method: 'get',
        header: this.data.header,
        success: res => {

          if (res.data.code == 200) {
            if (res.data.data.callback.length < 1) {
              this.show('您还未开通相关门店,请前去开通或联系客服')
            } else {
              this.dotCenter(res.data.data.callback[0].mall_dot_authorize_id, res.data.data.callback[0].order_num)
              setTimeout(function () {
                wx.navigateTo({
                  url: '../WhitCenter/WhitCenter?list=' + JSON.stringify(res.data.data.callback),
                })
              }, 500)

            }

          } else if (res.data.code == 401) {
            this.show(res.data.msg)
          } else {
            this.show(res.data.msg)
            wx.navigateTo({
              url: '/pages/Accredit/Accredit'
            })
          }
        }
      })
    }

  },
  dotCenter(mall_dot_authorize_id, order_num) {
    this.header(app.globalData.url + 'dotCenter');
    wx.request({
      url: app.globalData.url + 'dotCenter',
      header: this.data.header,
      method: 'get',
      data: {
        mall_dot_authorize_id: mall_dot_authorize_id,
        order_num: order_num
      },
      success: res => {
        if (res.data.code == 200) {
          app.top = res.data.data.callback
          wx.setStorageSync('top', res.data.data.callback)
        } else if (res.data.code == 401) {
          this.show(res.data.msg)
        } else {
          this.show(res.data.msg)
          wx.navigateTo({
            url: '/pages/Accredit/Accredit'
          })
        }

      }

    })
  },
	//获取名片
	getCode() {
		this.setData({
			isShow: true
		})
		var that = this;
		that.header(app.globalData.url + 'getQrCode');
		wx.request({
			url: app.globalData.url + 'getQrCode',
			method: 'GET',
			header: that.data.header,
			success: res => {
		
				if (res.data.code == 200) {
					this.setData({
						isShow: false
					})
					wx.setStorageSync('info', res.data.data.content)
						wx.navigateTo({
							url: "../getCode/getCode?code=1"
						})


				} else {
					utils.error(res);
				}
			}
		})
	},
	//收益列表跳转事件
	navCour: function() {
		utils.skip('../Earn/Earning')
	},
	//绑定手机号跳转
	BindPhone() {
    let referee_key_name = this.data.referee_key_name;
    let referee_nickname = this.data.referee_nickname;
    utils.skip('../BindPhone/BindPhone?referee_key_name=' + referee_key_name +'&referee_nickname='+referee_nickname);
	},
	query() {
		utils.skip('../Querys/Query')
	},
	// 粉丝订单跳转
	fanOrder: function() {
		utils.skip('../Fanorder/Fanorder')

	},
	Suggestions: function() {
		utils.skip('../Suggestions/Suggestions')

	},
	//未领礼物
	notgift() {
		utils.skip('../Notgifts/Notgifts')
	},
	//天天抢钱
	Ronmoney() {
		// utils.skip('../Robmoney/Robmoney')
		wx.navigateTo({
			url: '../Robmoney/Robmoney?type=2'
		})
	},
	//我的订单跳转事件
	myOrder: function() {
		utils.skip('../Order/Order?state=0')

	},
	// 跳转状态事件
	gettab: function(e) {
		app.tab = e.currentTarget.id;
		utils.skip('../Order/Order')
	},
	//跳转余额提现状态
	toBalance: function() {
		utils.skip('../Balance/Balance')
	},
	//跳转惠选购
	Bean: function() {
		utils.skip('../Bean/Bean')

	},
	//关于我们跳转
	aboutUs: function() {
		wx.navigateTo({
			url: '../Aboutus/Aboutus',
		})
	},
	//粉丝跳转
	FenNum: function() {
		utils.skip('../FenNum/FenNum')
	},
	calling: function(e) {
		this.Modal.showModal();
		wx.hideTabBar();

	},
	_confirmEventFirst: function() {
		this.Modal.hideModal();
		wx.showTabBar();
		let telephone = "'" + this.data.telephone + "'";
		wx.makePhoneCall({
			phoneNumber: telephone, //此号码并非真实电话号码，仅用于测试
			success: function() {
				console.log("拨打电话成功！")
			},
			fail: function() {
				console.log("拨打电话失败！")
			}
		})
	},
	_cancelEvent: function() {
		wx.showTabBar();
	},
	//收货地址跳转
	adress: function() {
		app.types = 1;
		utils.skip('../Address/Address')
	},
	//会员中心跳转
	toAttention() {
    var content = wx.getStorageSync('content');
    if(content){
      wx.navigateTo({
        url: '../MemCenter/MemCenter',
      })
    }else{
      wx.navigateTo({
       url: '../ Accredit / Accredit',
      })
    }
		
	},
	//页面跳转
	jump() {
    console.log('ss')
		wx.navigateTo({
			url: '../Accredit/Accredit',
		})
	},
	//跳转到账单
	Bill(e) {
		let ids = e.currentTarget.dataset.ids;
		let group = e.currentTarget.dataset.group;
		wx.navigateTo({
			url: '../Bill/Bill?ids=' + group + '&group=' + ids

		})
	},
	onReady: function() {
		this.Modal = this.selectComponent("#modal");
		var attentionAnim = wx.createAnimation({
			duration: 1000,
			timingFunction: 'linear',
			delay: 0
		})
		//设置循环动画
		this.attentionAnim = attentionAnim
		var next = true;
		setInterval(function() {
			if (next) {
				//根据需求实现相应的动画
				this.attentionAnim.translate(0, 4).step()
				next = !next;
			} else {
				this.attentionAnim.translate(0, 2).step()
				next = !next;
			}
			this.setData({
				//导出动画到指定控件animation属性
				attentionAnim: attentionAnim.export()
			})
		}.bind(this), 1200)

	},
	onShow: function() {
		wx.login({
			success: res => {
				wx.setStorageSync('codes', res.code)
			}

		})
		// 生命周期函数--监听页面显示
		var content = wx.getStorageSync('content');
    this.setData({
      content:content
    })
		// 没有授权登录
		if (content) {
			this.setData({
				usrState: 3
			})
			this.getUser();

		} else {
			// 已经获取授权登录
			this.setData({
      
				usrState: 0
			})
		}

		var content = wx.getStorageSync('content');
		if (content) {
			var nickname = content.data.content.userinfo.member_oauth[0].nickname;
			//用户信息
			var userInfo = content.data.content.userinfo.member_oauth;
			this.setData({
				money: content.data.content.userinfo.money,
				points: content.data.content.userinfo.points,
				fans_order_total: content.data.content.welfare.fans_order_total,
				fans_total: content.data.content.welfare.fans_total,
				order_total: content.data.content.order_total,
				receive_total: content.data.content.receive_total,

			})
			if (content.data.content.userinfo.mobile == '') {
				this.setData({
					usrState: 4
				})
			}
			//没有名称 显示微信数据
			if (nickname == '') {
				this.setData({
					usrState: 2
				})
			} else {
				this.setData({
					usrState: 3,
					userInfo: userInfo
				})
			}

			var mobile = content.data.content.userinfo.mobile;
			var virtual_money = content.data.content.userinfo.virtual_money;
			this.setData({
				mobile: mobile,
				virtual_money: virtual_money
			})


		}

		//没有手机号

	},
	onLoad: function() {
    var bg = wx.getStorageSync('bg');
		var telephone = wx.getStorageSync('telephone');
		var telephone_tip = wx.getStorageSync('telephone_tip');
    var platform = wx.getStorageSync('platform');
    var content = wx.getStorageSync('content')
		this.setData({
      bg:bg,
      platform: platform,
			telephone: telephone,
			telephone_tip: telephone_tip,
			Tname: app.globalData.Tname,
			Beans: app.globalData.Beans,
			Bean: app.globalData.Bean,
      content: content
		})
		app.types = 1;
		app.gift_praise_list = 0;
		var content = wx.getStorageSync('content');
		if (content) {
			this.getUser();

			this.setData({
				content: content
			})
			wx.setStorageSync("uuid", content.data.uuid);
			wx.setStorageSync("token", content.data.token);
			wx.setStorageSync("expiry_time", content.data.expiry_time);
		}

		new app.ToastPannel();
	},
	//生成随机字符串
	randomWord() {
		var noncestr;
		noncestr = '';
		var noncestrLength = 8;
		var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
			'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
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
	//获取个人信息
	getUser() {
		this.setData({
			isShow: true,
		})
		this.header(app.globalData.url + 'user');
		wx.request({
			url: app.globalData.url + 'user',
			method: 'get',
			header: this.data.header,
			success: res => {
				this.setData({
					isShow: false,
				})
				if (res.data.code == 200) {
          wx.setStorageSync('bg', res.data.data.content.background)
					this.setData({
						mall_giveaway_log: res.data.data.content.userinfo.mall_giveaway_log,
						is_show: res.data.data.content.welfare.is_show,
						fans_order_total: res.data.data.content.welfare.fans_order_total,
						fans_total: res.data.data.content.welfare.fans_total,
						content: res.data,
            money: res.data.data.content.userinfo.money,
            order_total: res.data.data.content.order_total,
            bill_type_group:res.data.data.content.reward.bill_type_group,
            bill_type_ids:res.data.data.content.reward.bill_type_ids,
            mobile:res.data.data.content.userinfo.mobile,
            referee_key_name:res.data.data.content.referee_key_name,
            referee_nickname:res.data.data.content.referee_nickname
					})
					wx.setStorage({
						key: 'content',
						data: res.data,
					})
					app.name = res.data.data.content.userinfo.member_oauth[0].nickname;
					wx.setStorageSync('member_mall', res.data.data.member_mall);
					wx.setStorageSync('cookie', res.header["Set-Cookie"]);
					wx.setStorageSync('money', res.data.data.content.userinfo.money)

				} else if (res.data.code == 5 || res.data.code == 6) {
					wx.clearStorageSync('content');
					this.show(res.data.msg);
				} else {
					wx.removeStorage({
						key: 'content',

					})

					// wx.clearStorageSync('content');

				}
			}
		})



	},
	//跳转我的分销
	Dis: utils.throttle(function(e) {
		this.activity();
	}, 1000),
	//
	// 分销中心
	distribution(member_mall_id) {
		var scenes = 0;
		var data = {};
		switch (scenes) {
			// 非订单验证
			case 0:
				data = {
					scene: 0,
					order_num: '',
					goods_id: 0,
					member_mall_id: 0
				}
				break;
				// 订单验证
			case 1:
				let goods_id = this.data.goods_id;
				let mall_goods_id = this.data.mall_goods_id;
				let order_num = this.data.order_num;
				data = {
					goods_id: goods_id,
					mall_goods_id: mall_goods_id,
					order_num: order_num
				}
				break;
		}
		this.header(app.globalData.url + 'distribution');
		wx.request({

			url: app.globalData.url + 'distribution',
			header: this.data.header,
			method: 'get',
			data: data,
			success: res => {
				if (res.data.code == 200) {
					wx.navigateTo({
						url: '../FyCenter/FyCenter?top=' + JSON.stringify(res.data.data.callback)
					})

				}
			}
		})
	},
	//赠送商家入驻
	activity() {
		this.setData({
			isShow: true,
		})
		this.header(app.globalData.url + 'activity');
		wx.request({
			url: app.globalData.url + 'activity',
			method: 'get',
			header: this.data.header,
			success: res => {
				this.setData({
					isShow: false,
				})
				if (res.data.code == 200) {
					let type = res.data.data.callback.type;
					switch (type) {
						case 0:
							app.scenes = 1;
							wx.setStorageSync('datas', res.data.data.callback)
							wx.navigateTo({
								url: '../jjb/jjb?data=' + JSON.stringify(res.data.data.callback),
							})
							break;
						case 1:
							this.distribution('')
							app.scenes = 0;
							break;
					}
				} else {
					this.show(res.data.code)
				}
			}
		})
	},
	//下拉刷新
onPullDownRefresh(){
	this.getUser();
	setTimeout(function(){
		wx.stopPullDownRefresh()
	},2000)
}
})
