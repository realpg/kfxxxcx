//index.js
const util = require('../..//utils/util.js')

//获取应用实例
const app = getApp()

var vm = null

Page({
  data: {
    motto: '如果用户未注册则弹出登录页面',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    vm = this
    //如果global为空，即本地没有缓存，用户未进行登录
    if (util.judgeIsAnyNullStr(app.globalData.userInfo)){
      util.showLoading();
      vm.login();
    }
  
  },
  onShow: function () {
    console.log("globalData:" + JSON.stringify(app.globalData.userInfo));
    if (app.globalData.userInfo) {

    } else { //如果本机没有缓存，跳转注册页面，这里逻辑有问题，用户可能更换手机，本机没有缓存，但在app.js中

    }
  },
  login: function (callBack) {
    wx.login({
      success: function (ret) {
        console.log("wx.login:" + JSON.stringify(ret))
        if (ret.code) {
          util.getOpenId({ code: ret.code }, function (ret) {
            // 进行后台检测用户
            var xcx_openid = ret.data.ret.openid;
            var param = {
              account_type: 'xcx',
              xcx_openid: xcx_openid
            }
            util.login(param, function (ret, err) {
              var msgObj = ret.data;
              if (msgObj.result) {  //登录成功，本地缓存信息
                vm.storeUserInfo(msgObj.ret);
              } else {
                //新用户引导注册
                var param = {
                  xcx_openid: xcx_openid
                }
                wx.navigateTo({
                  url: '/pages/register/register?jsonStr=' + JSON.stringify(param),
                })

              }
            })
          }, null);
        }
      }
    })
  }
})
